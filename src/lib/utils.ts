import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Match } from '@/types/(match)';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 사용자 위치 계산
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}

export function toRad(degree: number) {
  return degree * (Math.PI / 180);
}
// 30분 단위로 시간 슬롯 생성하는 함수

export const generateTimeSlots = (startTime: string, endTime: string) => {
  const slots = [];
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);

  const current = new Date(start);
  while (current <= end) {
    slots.push(
      current.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );
    current.setMinutes(current.getMinutes() + 30);
  }
  return slots;
};

// 현재 시간이 지났는지 체크하는 함수
export const isTimeSlotPassed = (timeSlot: string) => {
  const now = new Date();
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotDate = new Date();
  slotDate.setHours(hours, minutes, 0);

  return slotDate < now;
};

export const calculateEndTime = (startTime: string, durationHours: number) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(hours + durationHours, minutes);
  return endDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// 시간대 옵션 (30분 간격)
export const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minute}`;
});

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 날짜 포맷팅 함수
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}주 전`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}년 전`;
}

export function formatGameType(type: string): string {
  switch (type) {
    case 'THREE_BALL':
      return '3구';
    case 'FOUR_BALL':
      return '4구';
    default:
      return type;
  }
}

/**
 * 경기 시작 시간까지 남은 시간을 텍스트로 반환
 */
export function getTimeStatus(dateString: string): string {
  const now = new Date();
  const matchTime = new Date(dateString);
  const diffHours = (matchTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours < 0) return '지남';
  if (diffHours < 1) return `${Math.round(diffHours * 60)}분 후`;
  return `${Math.round(diffHours)}시간 후`;
}

/**
 * 상대방 ID를 반환하는 함수
 */
export function getOpponentId(match: any, userId: string): string {
  return match.player1_id === userId ? match.player2_id : match.player1_id;
}

// 체크인 가능 여부 확인 함수 - 기존의 canCheckIn 함수를 업데이트
export function canCheckIn(match: Match): boolean {
  return (
    match.match_status === 'ACCEPTED' && 
    !match.user_checked_in
  );
}

// 노쇼 신고 가능 여부 확인 함수
export function canReportNoShow(match: Match): boolean {
  return (
    match.match_status === 'IN_PROGRESS' &&
    match.user_checked_in &&
    !match.opponent_checked_in &&
    !match.no_show_status
  );
}