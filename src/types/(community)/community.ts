// 사용자 타입
export interface User {
  id: number;
  name: string;
  profile_image?: string | null;
  location?: string | null;
}

// 카테고리 타입
export interface Category {
  id: number;
  title: string;
  content?: string | null;
  icon?: string | null;
  order: number;
  is_active: boolean;
}

// 이미지 타입
export interface Image {
  id: number;
  url: string;
  public_id?: string | null;
  file_name: string;
  file_size: number;
  file_type: string;
  width?: number | null;
  height?: number | null;
}

// 게시글 이미지 관계 타입
export interface PostImage {
  id: number;
  post_id: number;
  image_id: number;
  order: number;
  image: Image;
}

// 태그 타입
export interface Tag {
  id: number;
  name: string;
}

export interface Etc {
  bi_post_like: number;
  bi_comment: number;
  bi_bookmark: number;
}

// 게시글 타입
export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: string;
  category_id: number;
  view_count: number;
  is_hot: boolean;
  is_pinned: boolean;
  is_deleted: boolean;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  updated_at: string;
  
  // 관계 필드 (실제 응답 구조에 맞게 수정)
  bi_user: {
    id: number;
    name: string;
    profile_image: string | null;
  };
  bi_category: {
    id: number;
    name: string;
    description: string;
    order: number;
    is_active: boolean;
  };
  bi_post_image: any[]; // 또는 더 구체적인 타입
  bi_post_tag: Tag[];
  _count: Etc;
  // 집계 필드
  likeCount: number;
  commentCount: number;
  
  // 사용자 액션 상태
  liked: boolean;
  bookmarked: boolean;
  
  // UI용 변환 필드
  imageSrc?: string | null;
  hasImage: boolean;
}

// 댓글 타입
export interface Comment {
  id: number;
  content: string;
  post_id: number;
  author_id: string;
  parent_id: number | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  bi_user: {
    id: number;
    name: string;
    profile_image: string | null;
  };
  other_bi_comment: Comment[];
  _count: {
    bi_comment_like: number;
  };
  liked?: boolean;
}

// API 응답 타입
export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CommentsResponse {
  comments: Comment[];
}

// 필터 타입
export interface FilterTag {
  id: string;
  name: string;
}