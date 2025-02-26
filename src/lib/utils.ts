import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

  let current = new Date(start);
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
