'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// 타입 정의
type EmotionType = 'bad' | 'neutral' | 'good' | null;
type PlayTimeType =
  | 'under20min'
  | '20to30min'
  | '30to1hours'
  | 'over1hours'
  | null;
type GameTypeType = '3ball' | '4ball' | 'pocket' | null;
type MatchResultType = string | null; // 승리한 사용자의 ID를 저장

export interface CategoryOption {
  title: string;
  selected: string | null;
  options: string[];
}

export interface Categories {
  manner: CategoryOption;
  rules: CategoryOption;
  time: CategoryOption;
  skill: CategoryOption;
  [key: string]: CategoryOption; // 인덱스 시그니처 추가
}

export interface MatchTarget {
  id: string;
  name: string;
  image?: string;
}

export interface MatchData {
  match_id: number;
  match_date: string;
  target: MatchTarget;
  current_user_id?: string; // 현재 사용자 ID 추가
}

export interface EvaluationFormData {
  match_id: number;
  target_id: string;
  overall_satisfaction: EmotionType;
  play_time: PlayTimeType;
  game_type: GameTypeType;
  high_run?: number;
  manner_category?: string;
  rules_category?: string;
  time_category?: string;
  skill_level_category?: string;
  comment?: string;
  is_anonymous: boolean;
  match_result: MatchResultType;
}

interface EvaluationContextType {
  // 데이터
  matchData: MatchData | null;
  formData: EvaluationFormData;
  categories: Categories;
  isSubmitting: boolean;
  isFormValid: boolean;
  isLoading: boolean;
  error: string | null;
  matchDetails: any | null;

  // 함수들
  updateFormData: <K extends keyof EvaluationFormData>(
    field: K,
    value: EvaluationFormData[K]
  ) => void;
  handleCategoryOptionSelect: (category: string, option: string) => void;
  submitEvaluation: () => Promise<void>;
  resetForm: () => void;
  getMatchData: (matchid: string) => Promise<void>;
}

// 기본값으로 사용할 카테고리 정의
const defaultCategories: Categories = {
  manner: {
    title: '🤝 상대방 매너 평가',
    selected: null,
    options: [
      '매우 친절해요',
      '예의 바르고 존중해요',
      '대화가 즐거웠어요',
      '불친절했어요',
    ],
  },
  rules: {
    title: '📏 상대방 규칙 준수 평가',
    selected: null,
    options: [
      '규칙을 잘 준수해요',
      '공정하게 게임해요',
      '규칙을 무시해요',
      '반칙이 잦았어요',
    ],
  },
  time: {
    title: '⏰ 상대방 시간 준수율',
    selected: null,
    options: [
      '정확히 시간을 지켜요',
      '약속 시간보다 일찍 와요',
      '약간 늦었어요',
      '많이 늦었어요',
    ],
  },
  skill: {
    title: '🎯 상대방의 점수는 적절했나요?',
    selected: null,
    options: [
      '등록된 점수보다 많이 높음',
      '등록된 점수보다 약간 높음',
      '등록된 점수와 적합',
      '등록된 점수보다 약간 낮음',
      '등록된 점수보다 많이 낲음',
    ],
  },
};

// Context 생성
const EvaluationContext = createContext<EvaluationContextType | undefined>(
  undefined
);

// Provider 컴포넌트
export function EvaluationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const matchid = params.matchId;
  const { toast } = useToast();

  // 상태 관리
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [categories, setCategories] = useState<Categories>(defaultCategories);

  // 초기 폼 데이터
  const [formData, setFormData] = useState<EvaluationFormData>({
    match_id: 0,
    target_id: '',
    overall_satisfaction: null,
    play_time: null,
    game_type: null,
    high_run: undefined,
    manner_category: undefined,
    rules_category: undefined,
    time_category: undefined,
    skill_level_category: undefined,
    comment: '',
    is_anonymous: false,
    match_result: null, // 승패 결과 초기값
  });

  // 매치 데이터 가져오는 함수
  const getMatchData = async (matchid: string) => {
    try {
      if (!matchid) {
        throw new Error('매치 ID가 없습니다.');
      }

      setIsLoading(true);
      const response = await fetch(`/api/match/mymatch/${matchid}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || '매치 정보를 불러오는데 실패했습니다.'
        );
      }

      const data = await response.json();
      setMatchDetails(data);

      // 세션에서 현재 사용자 ID 가져오기
      // 실제 환경에서는 세션 관리 방식에 맞게 수정 필요
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();
      const currentUserId = sessionData?.user?.mb_id || sessionData?.user?.id;

      if (!currentUserId) {
        throw new Error('로그인 정보를 찾을 수 없습니다.');
      }

      // 상대방 정보 결정
      let targetUser;

      if (data.player1_mb_id === currentUserId) {
        targetUser = {
          id: data.player2_mb_id || data.player2_id,
          name: data.player2_name || '상대방',
          image: data.player2_image,
        };
      } else {
        targetUser = {
          id: data.player1_mb_id || data.player1_id,
          name: data.player1_name || '상대방',
          image: data.player1_image,
        };
      }

      // 매치 데이터 설정
      const matchDataObj: MatchData = {
        match_id: data.match_id,
        match_date: new Date(data.match_date).toLocaleDateString(),
        target: targetUser,
        current_user_id: currentUserId,
      };

      // 승패 결과는 사용자가 직접 선택하도록 함
      const matchResult: MatchResultType = null;

      setMatchData(matchDataObj);

      // 폼 데이터 업데이트
      setFormData((prev) => ({
        ...prev,
        match_id: data.match_id,
        target_id: targetUser.id,
        // 게임 유형에 따른 기본값 설정
        game_type:
          data.game_type === 'THREE_BALL'
            ? '3ball'
            : data.game_type === 'FOUR_BALL'
              ? '4ball'
              : data.game_type === 'POCKET'
                ? 'pocket'
                : null,
        match_result: matchResult,
      }));

      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error('매치 데이터 로딩 오류:', error);
      setError(
        error instanceof Error
          ? error.message
          : '데이터 로딩 중 오류가 발생했습니다.'
      );
      setIsLoading(false);

      toast({
        variant: 'destructive',
        title: '오류 발생',
        description:
          error instanceof Error
            ? error.message
            : '매치 정보를 불러오는데 실패했습니다.',
      });
    }
  };

  // 컴포넌트 마운트 시 매치 데이터 로드
  useEffect(() => {
    if (typeof matchid === 'string') {
      getMatchData(matchid);
    }
  }, [matchid]);

  // 폼 데이터 업데이트 함수
  const updateFormData = <K extends keyof EvaluationFormData>(
    field: K,
    value: EvaluationFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 카테고리 옵션 선택 핸들러
  const handleCategoryOptionSelect = (category: string, option: string) => {
    // 현재 선택 상태 확인
    const currentSelected = categories[category].selected;
    const newSelected = currentSelected === option ? null : option;

    // 카테고리 상태 업데이트
    setCategories((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        selected: newSelected,
      },
    }));

    // formData도 함께 업데이트
    if (category === 'manner') {
      updateFormData('manner_category', newSelected || undefined);
    } else if (category === 'rules') {
      updateFormData('rules_category', newSelected || undefined);
    } else if (category === 'time') {
      updateFormData('time_category', newSelected || undefined);
    } else if (category === 'skill') {
      updateFormData('skill_level_category', newSelected || undefined);
    }
  };

  // 폼 리셋 함수
  const resetForm = () => {
    setFormData({
      match_id: matchData?.match_id || 0,
      target_id: matchData?.target.id || '',
      overall_satisfaction: null,
      play_time: null,
      game_type: null,
      high_run: undefined,
      manner_category: undefined,
      rules_category: undefined,
      time_category: undefined,
      skill_level_category: undefined,
      comment: '',
      is_anonymous: false,
      match_result: null,
    });

    setCategories(defaultCategories);
  };

  // 폼 유효성 검사
  const isFormValid =
    formData.play_time !== null &&
    formData.game_type !== null &&
    formData.match_id !== 0 &&
    formData.target_id !== '' &&
    formData.match_result !== null;

  // 폼 제출 함수
  const submitEvaluation = async () => {
    if (!isFormValid) {
      toast({
        variant: 'destructive',
        title: '입력 오류',
        description: '필수 항목을 모두 입력해주세요.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/match/evalueate/postevalueate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '평가 제출 중 오류가 발생했습니다.');
      }

      toast({
        title: '평가 완료',
        description: '평가가 성공적으로 등록되었습니다.',
      });

      router.push('/mobile/management'); // 매치 히스토리 페이지로 이동
      router.refresh(); // 페이지 새로고침
    } catch (error) {
      console.error('평가 제출 오류:', error);

      toast({
        variant: 'destructive',
        title: '제출 오류',
        description:
          error instanceof Error
            ? error.message
            : '평가 제출 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EvaluationContext.Provider
      value={{
        matchData,
        formData,
        categories,
        isSubmitting,
        isFormValid,
        isLoading,
        error,
        matchDetails,
        updateFormData,
        handleCategoryOptionSelect,
        submitEvaluation,
        resetForm,
        getMatchData,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
}

// Custom Hook
export function useEvaluation() {
  const context = useContext(EvaluationContext);
  if (context === undefined) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
}
