'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Match, Coordinates } from '@/types/(match)';
import { calculateDistance } from '@/lib/kakaomap';
import { CheckinEffect } from '@/components/card/check-in';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

import { Clock } from 'lucide-react';

interface MatchItemActionsProps {
  match: Match;
  userId: string;
  canCheckIn: boolean;
  canReportNoShow: boolean;
  handleCheckIn: (matchId: number) => Promise<void>;
  handleReportNoShow: (matchId: number, opponentId: string) => Promise<void>;
  handleComplete: (matchId: number) => void;
  handleEvaluate: (matchId: number) => void;
  opponentId: string;
  onDistanceChange?: (distance: number | null) => void;
}

export function MatchItemActions({
  match,
  canCheckIn,
  canReportNoShow,
  handleCheckIn,
  handleReportNoShow,
  handleComplete,
  handleEvaluate,
  opponentId,
  onDistanceChange,
}: MatchItemActionsProps) {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLate, setIsLate] = useState<boolean>(false);
  const [lateMinutes, setLateMinutes] = useState<number>(0);
  const [showCheckinEffect, setShowCheckinEffect] = useState<boolean>(false);
  // 위치 기반 체크인 가능 여부 (100m 이내일 때)
  const MAX_CHECK_IN_DISTANCE = 2000; // 미터 단위
  const [isWithinCheckInDistance, setIsWithinCheckInDistance] =
    useState<boolean>(false);

  // 지각 패널티 레벨 계산 함수
  const calculateLateLevel = (minutes: number) => {
    if (minutes <= 10) {
      return { level: 1, points: 1, description: '10분 이내 지각' };
    } else if (minutes <= 20) {
      return { level: 2, points: 2, description: '10~20분 지각' };
    } else {
      return {
        level: 3,
        points: 3,
        description: '20분 이상 지각(노쇼와 동일)',
      };
    }
  };

  // 현재 시간과 약속 시간의 차이 계산
  useEffect(() => {
    if (match.preferred_date && canCheckIn) {
      const preferredDate = new Date(match.preferred_date);
      const now = new Date();

      // 분 단위 차이 계산
      const diffMs = now.getTime() - preferredDate.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffMinutes > 0) {
        setIsLate(true);
        setLateMinutes(diffMinutes);
      } else {
        setIsLate(false);
        setLateMinutes(0);
      }
    }
  }, [match.preferred_date, canCheckIn]);

  // 현재 위치 가져오기
  const getCurrentLocation = async (): Promise<void> => {
    setIsLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { latitude, longitude };

        // 사용자 위치 디버깅
        console.log('사용자 좌표:', userLocation);

        setCurrentLocation(userLocation);

        // 당구장 위치와 거리 계산
        if (match.venue && match.venue.latitude && match.venue.longitude) {
          try {
            // 당구장 좌표가 문자열인 경우 숫자로 변환
            const venueLocation = {
              latitude:
                typeof match.venue.latitude === 'string'
                  ? parseFloat(match.venue.latitude)
                  : match.venue.latitude,
              longitude:
                typeof match.venue.longitude === 'string'
                  ? parseFloat(match.venue.longitude)
                  : match.venue.longitude,
            };

            // 당구장 좌표 디버깅
            console.log('당구장 좌표:', venueLocation);

            // 거리 계산 유틸리티 함수 사용
            const dist = await calculateDistance(userLocation, venueLocation);

            // 계산된 거리 로깅
            console.log('계산된 거리(m):', Math.round(dist));

            setDistance(dist);
            onDistanceChange?.(dist);
            // distance 상태는 비동기적으로 업데이트되므로 직접 dist 값을 사용
            setIsWithinCheckInDistance(dist <= MAX_CHECK_IN_DISTANCE);
          } catch (error) {
            console.error('거리 계산 오류:', error);
            setLocationError('거리 계산 중 오류가 발생했습니다.');
          }
        } else {
          setLocationError('당구장 위치 정보가 없습니다.');
        }

        setIsLoading(false);
      },
      (error: GeolocationPositionError) => {
        setIsLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('위치 정보 접근 권한이 거부되었습니다.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('위치 정보를 사용할 수 없습니다.');
            break;
          case error.TIMEOUT:
            setLocationError('위치 정보 요청 시간이 초과되었습니다.');
            break;
          default:
            setLocationError('위치 정보를 가져오는 중 오류가 발생했습니다.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 위치 확인 후 체크인 처리
  const handleLocationCheckIn = async (): Promise<void> => {
    if (!currentLocation) {
      getCurrentLocation();
      return;
    }

    if (isWithinCheckInDistance) {
      if (isLate) {
        const lateLevel = calculateLateLevel(lateMinutes);
        const confirmCheckin = window.confirm(
          `현재 ${lateMinutes}분 지각 상태입니다. ${lateLevel.description}으로 ${lateLevel.points}회 패널티가 부과됩니다. 계속하시겠습니까?`
        );

        if (!confirmCheckin) {
          return;
        }
      }

      setIsLoading(true);
      try {
        await handleCheckIn(match.match_id);
        setShowCheckinEffect(true);
      } catch (error) {
        console.error('체크인 오류:', error);
        alert('체크인 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert(
        `체크인하려면 당구장 ${MAX_CHECK_IN_DISTANCE}m 이내에 있어야 합니다. 현재 거리: ${Math.round(distance || 0)}m`
      );
    }
  };

  // 위치 정보 초기화
  useEffect(() => {
    if (match.match_status === 'ACCEPTED' && canCheckIn) {
      getCurrentLocation();
    }
  }, [match.match_status, canCheckIn]);

  return (
    <>
      <CheckinEffect
        show={showCheckinEffect}
        onComplete={() => setShowCheckinEffect(false)}
      />

      {match.match_status === 'ACCEPTED' && canCheckIn && (
        <div className="flex flex-1 flex-col gap-2">
          {isLate && (
            <Alert
              variant={lateMinutes > 20 ? 'destructive' : 'destructive'}
              className="mb-2"
            >
              <Clock className="h-4 w-4" />
              <AlertTitle>지각 알림</AlertTitle>
              <AlertDescription>
                약속 시간보다 {lateMinutes}분 늦었습니다.
                {calculateLateLevel(lateMinutes).description}으로{' '}
                {calculateLateLevel(lateMinutes).points}회 패널티가 부과됩니다.
              </AlertDescription>
            </Alert>
          )}

          <Button
            className={`h-12 flex-1 ${
              isWithinCheckInDistance
                ? isLate
                  ? lateMinutes > 20
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400'
            }`}
            onClick={handleLocationCheckIn}
            disabled={
              isLoading || (!isWithinCheckInDistance && distance !== null)
            }
          >
            {isLoading
              ? '체크인 중...'
              : !currentLocation
                ? '위치 확인하기'
                : isWithinCheckInDistance
                  ? `체크인하기${isLate ? ` (${lateMinutes}분 지각)` : ''}`
                  : `${MAX_CHECK_IN_DISTANCE}m 이내로 이동 필요`}
          </Button>

          {locationError && (
            <div className="flex items-center text-xs text-red-500">
              <AlertCircle className="mr-1 h-3 w-3" />
              {locationError}
            </div>
          )}
        </div>
      )}

      {match.match_status === 'ACCEPTED' && !canCheckIn && (
        <Button
          className="h-12 flex-1 bg-gray-100 text-gray-500 hover:bg-gray-200"
          onClick={() => handleComplete(match.match_id)}
        >
          경기 취소
        </Button>
      )}

      {match.match_status === 'IN_PROGRESS' && canReportNoShow && (
        <Button
          className="flex-1 bg-red-600 text-white hover:bg-red-700"
          onClick={() => handleReportNoShow(match.match_id, opponentId)}
        >
          No-Show 신고
        </Button>
      )}

      {match.match_status === 'IN_PROGRESS' && !canReportNoShow && (
        <Button
          className="flex-1 bg-green-600 text-white hover:bg-green-700"
          onClick={() => handleComplete(match.match_id)}
        >
          경기 종료
        </Button>
      )}

      {match.match_status === 'COMPLETED' && match.has_rated && (
        <div className="flex flex-1 flex-col gap-1">
          <Button className="flex-1 bg-purple-100 text-purple-700" disabled>
            <CheckCircle className="mr-1 h-4 w-4" /> 평가 완료
          </Button>
          {!match.opponent_has_rated && (
            <div className="text-center text-xs text-gray-500">
              상대방이 아직 평가하지 않았습니다
            </div>
          )}
        </div>
      )}

      {match.match_status === 'COMPLETED' && !match.has_rated && (
        <div className="flex flex-1 flex-col gap-1">
          <Button
            className="flex-1 bg-yellow-600 text-white hover:bg-yellow-700"
            onClick={() => handleEvaluate(match.match_id)}
          >
            평가하기
          </Button>
          {match.opponent_has_rated && (
            <div className="text-center text-xs text-gray-500">
              상대방은 이미 평가를 완료했습니다
            </div>
          )}
        </div>
      )}

      {(match.match_status === 'EVALUATE' || match.both_rated) && (
        <span className="flex flex-1 items-center justify-center text-sm text-green-600">
          <CheckCircle className="mr-1 h-4 w-4" /> 평가 완료
        </span>
      )}
    </>
  );
}
