// types/report.ts

// 신고 상태 유형
export type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

// 신고 유형
export type ReportType = 
  | 'HARASSMENT' 
  | 'SPAM' 
  | 'INAPPROPRIATE' 
  | 'HATE_SPEECH' 
  | 'THREAT' 
  | 'PERSONAL_INFO' 
  | 'OTHER';

// 콘텐츠 유형
export type ContentType = 'POST' | 'COMMENT' | 'MESSAGE' | 'PROFILE' | null;

// 조치 유형
export type ActionType = 
  | 'WARNING' 
  | 'CONTENT_REMOVAL' 
  | 'TEMPORARY_BAN' 
  | 'PERMANENT_BAN' 
  | 'NO_ACTION' 
  | null;

// 신고 인터페이스
export interface Report {
  id: string;
  created_at: Date;
  updated_at: Date;
  reporter_id: string;
  reporter_name: string;
  reported_user_id: string;
  reported_user_name: string;
  content_id: string | null;
  content_type: ContentType;
  type: ReportType;
  description: string | null;
  status: ReportStatus;
  ip_address: string | null;
  action_taken: ActionType;
}

// 신고 리뷰 인터페이스
export interface ReportReview {
  id: string;
  created_at: Date;
  moderator_id: string;
  moderator_name?: string;
  report_id: string;
  decision: ActionType;
  comment: string | null;
}

// 신고 통계 인터페이스
export interface ReportMetrics {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  falseReports: number;
  reportsByType: {
    HARASSMENT: number;
    SPAM: number;
    INAPPROPRIATE: number;
    HATE_SPEECH: number;
    THREAT: number;
    PERSONAL_INFO: number;
    OTHER: number;
    [key: string]: number;
  };
  reportsByDate: ChartDataItem[];
}

// 차트 데이터 아이템
export interface ChartDataItem {
  date: string;
  count: number;
}

// 필터 상태 인터페이스
export interface ReportFilters {
  status: string;
  type: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  search: string;
}

// 페이지네이션 인터페이스
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// API 응답 인터페이스
export interface ReportsApiResponse {
  reports: Report[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface ReportReviewPayload {
  decision: ActionType;
  comment?: string;
}

export interface ReportReviewResponse {
  message: string;
  report: Report;
  review: ReportReview;
}