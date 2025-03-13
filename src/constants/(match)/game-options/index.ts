import { OptionType } from '@/types/(match)';

export const gameOptions: OptionType[] = [
  {
    id: 'FOUR_BALL',
    value: 'FOUR_BALL',
    title: '4구',
    description: '흰공, 노란공, 빨간공 2개로 이루어진 게임',
    srcUrl:'/ball/fourball.png'
  },
  {
    id: 'THREE_BALL',
    value: 'THREE_BALL',
    title: '3구',
    description: '흰공, 노란공, 빨간공으로 이루어진 게임',
    srcUrl:'/ball/threeball.png'
  },
  {
    id: 'POCKET_BALL',
    value: 'POCKET_BALL',
    title: '포켓볼',
    description: '총 15개로 본인의 공을 먼저 넣는 게임',
    srcUrl:'/ball/pocketball.png'
  },
];
