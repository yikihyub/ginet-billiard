export const getGameTypeLabel = (type: string) => {
    const types = {
      FOUR_BALL: '4구',
      THREE_BALL: '3구',
      POCKET_BALL: '포켓볼',
    };
    return types[type as keyof typeof types] || type;
  };
  
  export const getMatchTypeLabel = (type: string) => {
    const types = {
      ONE_VS_ONE: '1:1',
      TWO_VS_TWO: '2:2',
    };
    return types[type as keyof typeof types] || type;
  };
  
  export const getStatusLabels = () => {
    return {
      PENDING: '대기중',
      ACCEPTED: '매칭완료',
      IN_PROGRESS: '경기중',
      COMPLETED: '경기종료',
      CANCELLED: '취소됨',
    };
  };
  
  export const getStatusVariants = (): Record<
    string,
    'default' | 'destructive' | 'secondary' | 'outline'
  > => {
    return {
      PENDING: 'default',
      ACCEPTED: 'secondary',
      IN_PROGRESS: 'outline',
      COMPLETED: 'destructive',
    };
  };