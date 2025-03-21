import { FilterTag } from '@/types/(community)/community';

export const filterTags: FilterTag[] = [
  { id: 'all', name: '전체글' },
  { id: 'recent', name: '최신글' },
  { id: 'popular', name: '인기글' },
  { id: 'many-comments', name: '댓글 많은 글' },
  { id: 'many-views', name: '조회 많은 글' },
];