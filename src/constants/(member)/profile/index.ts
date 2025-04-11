import { GameType } from "@/types/(match)";
import { PlayTime } from "@/types/(match)";

  // 카테고리 정의
  export const categories = {
    manner: {
      title: '🤝 상대방 매너 평가',
      options: [
        '매우 친절해요',
        '예의 바르고 존중해요',
        '대화가 즐거웠어요',
        '불친절했어요',
      ],
      icon: '💗',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-800',
    },
    rules: {
      title: '📏 상대방 규칙 준수 평가',
      options: [
        '규칙을 잘 준수해요',
        '공정하게 게임해요',
        '규칙을 무시해요',
        '반칙이 잦았어요',
      ],
      icon: '📏',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
    time: {
      title: '⏰ 상대방 시간 준수율',
      options: [
        '정확히 시간을 지켜요',
        '약속 시간보다 일찍 와요',
        '약간 늦었어요',
        '많이 늦었어요',
      ],
      icon: '⏰',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    skill: {
      title: '🎯 상대방의 점수는 적절했나요?',
      options: [
        '등록된 점수보다 많이 높음',
        '등록된 점수보다 약간 높음',
        '등록된 점수와 적합',
        '등록된 점수보다 약간 낮음',
        '등록된 점수보다 많이 낮음',
      ],
      icon: '🎯',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
  };

// 카테고리별 표시 이름과 색상 매핑
  export const categoryDisplayMap = {
    manner: {
      title: '매너',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '🤝',
    },
    rules: {
      title: '규칙 준수',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: '📏',
    },
    time: {
      title: '시간 준수',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      icon: '⏰',
    },
    skill: {
      title: '실력 수준',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: '🎯',
    },
  };

// 매핑 객체에 타입 지정
export const gameTypeMap: Record<GameType, string> = {
  '3ball': '3구',
  '4ball': '4구',
  pocket: '포켓볼',
};

export const playTimeMap: Record<PlayTime, string> = {
  under20min: '20분 이내',
  '20to30min': '20분~30분',
  '30to1hours': '30분~1시간',
  over1hours: '1시간 이상',
};