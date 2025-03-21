import { FormStep } from '@/types/(club)/club';

// 단계별 제목과 설명 정의
export const stepTitles: Record<
  FormStep,
  { title: string; description: string }
> = {
  agreement: {
    title: `모두가 즐거운 당구장 동호회가 \n 될 수 있도록 함께 지켜주세요`,
    description: '서비스 이용을 위해 필수 약관에 동의해주세요',
  },
  type: {
    title: '멤버들과 함께 어떤 활동을 하고싶나요?',
    description: '활동 유형에 따라 동호회를 만들어보세요',
  },
  basic: {
    title: '동호회의 기본 정보를 입력해주세요',
    description: '동호회를 대표하는 정보입니다',
  },
  details: {
    title: '동호회의 상세 정보를 입력해주세요',
    description: '회원들이 동호회를 이해하는데 도움이 됩니다',
  },
  rules: {
    title: '동호회 규칙을 설정해주세요',
    description: '원활한 동호회 운영을 위한 규칙을 정해주세요',
  },
  location: {
    title: '주요 활동 장소를 입력해주세요',
    description: '주로 활동하는 당구장 정보를 알려주세요',
  },
  contact: {
    title: '연락처 정보를 입력해주세요',
    description: '문의할 수 있는 연락처를 제공해주세요',
  },
  review: {
    title: '등록할 동호회 정보를 확인해주세요',
    description: '제출 전 마지막으로 정보를 검토하세요',
  },
};
