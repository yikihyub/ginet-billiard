'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Trash2, MessageSquare } from 'lucide-react';
import { useInquiry } from '@/app/mobile/mypage/_hooks/useInquiry';

export default function AdminInquiriesPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.mb_id;
  const router = useRouter();
  const { toast } = useToast();
  const {
    loading,
    inquiries,
    pagination,
    getInquiries,
    answerInquiry,
    deleteInquiry,
  } = useInquiry();

  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openAnswerDialog, setOpenAnswerDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [answerText, setAnswerText] = useState('');

  // 세션 확인 (관리자 권한 체크)
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.bi_level !== 'ADMIN') {
        toast({
          title: '접근 권한 없음',
          description: '관리자만 접근할 수 있는 페이지입니다.',
          variant: 'destructive',
        });
        router.push('/');
      } else {
        // 관리자인 경우 문의 목록 불러오기
        fetchInquiries();
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, pagination.page]);

  // 문의 목록 불러오기
  const fetchInquiries = () => {
    getInquiries({
      isAdmin: true,
      page: pagination.page,
      limit: pagination.limit,
      user_id: userId!,
    });
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 검색 실행
  const handleSearch = () => {
    // 검색 기능은 서버 API에 구현 필요
    toast({
      title: '검색 기능',
      description: '검색 기능은 서버 API에 추가 구현이 필요합니다.',
    });
  };

  // 상태 필터 변경 핸들러
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    // 상태 필터링 기능은 서버 API에 구현 필요
  };

  // 답변 다이얼로그 열기
  const openAnswer = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setAnswerText(inquiry.answer || '');
    setOpenAnswerDialog(true);
  };

  // 삭제 다이얼로그 열기
  const openDelete = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setOpenDeleteDialog(true);
  };

  // 답변 제출 핸들러
  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) {
      toast({
        title: '답변 내용 필요',
        description: '답변 내용을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await answerInquiry(selectedInquiry.id, answerText);
      setOpenAnswerDialog(false);
      fetchInquiries();
    } catch (error) {
      console.log(error);
      // 에러는 useInquiry에서 처리됨
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    try {
      await deleteInquiry(selectedInquiry.id);
      setOpenDeleteDialog(false);
      fetchInquiries();
    } catch (error) {
      console.log(error);
      // 에러는 useInquiry에서 처리됨
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    getInquiries({
      isAdmin: true,
      page: newPage,
      limit: pagination.limit,
    });
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 로딩 중이거나 인증되지 않은 경우
  if (
    status === 'loading' ||
    (status === 'authenticated' && session?.user?.bi_level !== 'ADMIN')
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">문의 관리</h1>

      {/* 검색 및 필터링 */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="flex w-full md:w-auto">
          <Input
            placeholder="이름, 이메일, 제목 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="rounded-r-none"
          />
          <Button className="rounded-l-none" onClick={handleSearch}>
            <Search size={18} />
          </Button>
        </div>

        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="pending">답변 대기중</SelectItem>
            <SelectItem value="answered">답변 완료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 문의 목록 테이블 */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left text-sm font-medium">상태</th>
              <th className="p-3 text-left text-sm font-medium">제목</th>
              <th className="p-3 text-left text-sm font-medium">이름</th>
              <th className="p-3 text-left text-sm font-medium">이메일</th>
              <th className="p-3 text-left text-sm font-medium">등록일</th>
              <th className="p-3 text-left text-sm font-medium">답변일</th>
              <th className="p-3 text-left text-sm font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  <Loader2
                    size={24}
                    className="mx-auto animate-spin text-blue-600"
                  />
                </td>
              </tr>
            ) : inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        inquiry.status === 'answered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {inquiry.status === 'answered'
                        ? '답변완료'
                        : '답변대기중'}
                    </span>
                  </td>
                  <td className="p-3">{inquiry.subject}</td>
                  <td className="p-3">{inquiry.name}</td>
                  <td className="p-3">{inquiry.email}</td>
                  <td className="p-3">{formatDate(inquiry.created_at)}</td>
                  <td className="p-3">{formatDate(inquiry.answered_at)}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-blue-600"
                        onClick={() => openAnswer(inquiry)}
                      >
                        <MessageSquare size={16} className="mr-1" />
                        답변
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-red-600"
                        onClick={() => openDelete(inquiry)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  문의 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                pagination.page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* 답변 다이얼로그 */}
      <Dialog open={openAnswerDialog} onOpenChange={setOpenAnswerDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>문의 답변</DialogTitle>
            <DialogDescription>
              고객 문의에 답변을 작성합니다. 답변은 고객에게 즉시 전달됩니다.
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <>
              <div className="my-4 space-y-4">
                <div className="rounded bg-gray-50 p-3">
                  <h3 className="font-medium">{selectedInquiry.subject}</h3>
                  <p className="my-1 text-sm text-gray-500">
                    {selectedInquiry.name} ({selectedInquiry.email}) |{' '}
                    {formatDate(selectedInquiry.createdAt)}
                  </p>
                  <p className="mt-2 text-sm">{selectedInquiry.message}</p>
                </div>

                <div>
                  <Label htmlFor="answer" className="text-sm font-medium">
                    답변 내용
                  </Label>
                  <Textarea
                    id="answer"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={6}
                    placeholder="고객님의 문의에 답변을 작성해주세요."
                    className="mt-1"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenAnswerDialog(false)}
                >
                  취소
                </Button>
                <Button onClick={handleAnswerSubmit} disabled={loading}>
                  {loading ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : null}
                  답변 등록
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>문의 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 문의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : null}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
