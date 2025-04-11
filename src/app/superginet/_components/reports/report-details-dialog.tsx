'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  AlertCircle,
  FileText,
  Link,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// 신고 타입 정의
type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';
type ReportType =
  | 'HARASSMENT'
  | 'SPAM'
  | 'INAPPROPRIATE'
  | 'HATE_SPEECH'
  | 'THREAT'
  | 'PERSONAL_INFO'
  | 'OTHER';
type ContentType = 'POST' | 'COMMENT' | 'MESSAGE' | 'PROFILE' | null;
type ActionType =
  | 'WARNING'
  | 'CONTENT_REMOVAL'
  | 'TEMPORARY_BAN'
  | 'PERMANENT_BAN'
  | 'NO_ACTION'
  | null;

interface Report {
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

interface ReportDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report;
  onActionComplete: () => void;
}

export default function ReportDetailsDialog({
  open,
  onOpenChange,
  report,
  onActionComplete,
}: ReportDetailsDialogProps) {
  const [action, setAction] = useState<ActionType>(null);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // 컨텐츠 타입에 따른 텍스트
  const getContentTypeText = (type: ContentType): string => {
    switch (type) {
      case 'POST':
        return '게시물';
      case 'COMMENT':
        return '댓글';
      case 'MESSAGE':
        return '메시지';
      case 'PROFILE':
        return '프로필';
      default:
        return type || '미지정';
    }
  };

  // 보고서 유형에 따른 텍스트
  const getReportTypeText = (type: ReportType): string => {
    switch (type) {
      case 'HARASSMENT':
        return '괴롭힘';
      case 'SPAM':
        return '스팸';
      case 'INAPPROPRIATE':
        return '부적절한 내용';
      case 'HATE_SPEECH':
        return '혐오 발언';
      case 'THREAT':
        return '위협';
      case 'PERSONAL_INFO':
        return '개인정보 유출';
      case 'OTHER':
        return '기타';
      default:
        return type;
    }
  };

  // 보고서 상태에 따른 배지 생성
  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            처리 대기중
          </Badge>
        );
      case 'RESOLVED':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            해결됨
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            <AlertTriangle className="mr-1 h-3 w-3" />
            거부됨
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 조치 유형에 따른 텍스트
  const getActionTypeText = (type: ActionType): string => {
    switch (type) {
      case 'WARNING':
        return '경고';
      case 'CONTENT_REMOVAL':
        return '컨텐츠 삭제';
      case 'TEMPORARY_BAN':
        return '임시 정지';
      case 'PERMANENT_BAN':
        return '영구 정지';
      case 'NO_ACTION':
        return '조치 없음';
      default:
        return type || '미지정';
    }
  };

  // 조치 제출 처리
  const handleSubmitAction = async () => {
    if (!action) {
      setError('조치 유형을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // API 호출 예시 (실제 구현 필요)
      // const response = await fetch(`/api/admin/reports/${report.id}/review`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     decision: action,
      //     comment: comment,
      //     moderator_id: "현재_관리자_ID", // 실제 구현시 세션에서 가져옴
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error("처리 중 오류가 발생했습니다.");
      // }

      // 임시로 성공 처리
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);

      // 부모 컴포넌트에 완료 알림
      setTimeout(() => {
        onActionComplete();
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '처리 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>신고 상세 정보</DialogTitle>
          <DialogDescription>
            신고 ID: {report.id} -{' '}
            {format(new Date(report.created_at), 'yyyy-MM-dd HH:mm')}
          </DialogDescription>
        </DialogHeader>

        {/* 상태 배지 */}
        <div className="mb-4">{getStatusBadge(report.status)}</div>

        {/* 주요 정보 */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">신고자</Label>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>
                {report.reporter_name} ({report.reporter_id})
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">신고 대상</Label>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>
                {report.reported_user_name} ({report.reported_user_id})
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">신고 유형</Label>
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>{getReportTypeText(report.type)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">콘텐츠 유형</Label>
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>{getContentTypeText(report.content_type)}</span>
            </div>
          </div>
          {report.content_id && (
            <div className="col-span-2 space-y-2">
              <Label className="text-sm text-muted-foreground">콘텐츠 ID</Label>
              <div className="flex items-center">
                <Link className="mr-2 h-4 w-4" />
                <span>{report.content_id}</span>
              </div>
            </div>
          )}
        </div>

        {/* 신고 내용 */}
        <div className="mb-6">
          <Label className="mb-2 block text-sm text-muted-foreground">
            신고 내용
          </Label>
          <div className="whitespace-pre-wrap rounded-md bg-muted p-4">
            {report.description || '상세 내용이 없습니다.'}
          </div>
        </div>

        {/* 추가 정보 아코디언 */}
        <Accordion type="single" collapsible className="mb-6">
          <AccordionItem value="additional-info">
            <AccordionTrigger>추가 정보</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    IP 주소
                  </Label>
                  <div className="text-sm">
                    {report.ip_address || '기록 없음'}
                  </div>
                </div>
                {report.action_taken && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      이전 조치
                    </Label>
                    <div className="text-sm">
                      {getActionTypeText(report.action_taken)}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* 처리 폼 (처리대기중 상태일 때만 표시) */}
        {report.status === 'PENDING' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="action">조치 선택</Label>
              <Select
                value={action || ''}
                onValueChange={(value) => setAction(value as ActionType)}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="취할 조치를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WARNING">경고</SelectItem>
                  <SelectItem value="CONTENT_REMOVAL">컨텐츠 삭제</SelectItem>
                  <SelectItem value="TEMPORARY_BAN">임시 정지</SelectItem>
                  <SelectItem value="PERMANENT_BAN">영구 정지</SelectItem>
                  <SelectItem value="NO_ACTION">조치 없음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">관리자 코멘트</Label>
              <Textarea
                id="comment"
                placeholder="조치에 대한 코멘트를 입력하세요 (선택사항)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>성공</AlertTitle>
                <AlertDescription>
                  신고가 성공적으로 처리되었습니다.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          {report.status === 'PENDING' ? (
            <Button onClick={handleSubmitAction} disabled={loading || success}>
              {loading ? '처리 중...' : '조치 제출'}
            </Button>
          ) : (
            <Button onClick={() => onOpenChange(false)}>닫기</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
