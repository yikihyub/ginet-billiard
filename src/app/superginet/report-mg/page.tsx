'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, RefreshCw, Search } from 'lucide-react';
import ReportDetailsDialog from '../_components/reports/report-details-dialog';
import ReportMetricsChart from '../_components/reports/report-metrics-chart';
import { cn } from '@/lib/utils';

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

interface Metrics {
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
  };
  reportsByDate: {
    date: string;
    count: number;
  }[];
}

interface Filters {
  status: string;
  type: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  search: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // 필터 상태
  const [filters, setFilters] = useState<Filters>({
    status: searchParams.get('status') || 'ALL',
    type: searchParams.get('type') || 'ALL',
    dateFrom: new Date(),
    dateTo: new Date(),
    search: searchParams.get('search') || '',
  });

  // 페이지 로드시 데이터 가져오기
  useEffect(() => {
    fetchReports();
    fetchMetrics();
  }, [filters, pagination.currentPage]);

  // 보고서 데이터 가져오기 (실제 구현시에는 API 호출로 대체)
  const fetchReports = async () => {
    setLoading(true);
    try {
      // API 호출 예시 (실제 구현 필요)
      const response = await fetch(
        `/api/reports?page=${pagination.currentPage}&status=${filters.status}&limit=${10}&type=${filters.type}&search=${filters.search}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}`
      );
      const data = await response.json();
      setReports(data.reports);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
      });
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // 통계 데이터 가져오기
  const fetchMetrics = async () => {
    try {
      // API 호출 예시 (실제 구현 필요)
      const response = await fetch('/api/reports/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  // 필터 변경 처리
  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  // 보고서 상세 보기
  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  // 보고서 상태에 따른 배지 색상
  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            처리 대기중
          </Badge>
        );
      case 'RESOLVED':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            해결됨
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            거부됨
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 보고서 유형에 따른 텍스트
  const getReportTypeText = (type: ReportType) => {
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">신고 관리</h1>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">신고 목록</TabsTrigger>
          <TabsTrigger value="metrics">통계</TabsTrigger>
        </TabsList>

        {/* 신고 목록 탭 */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>신고 목록</CardTitle>
              <CardDescription>
                사용자가 제출한 신고를 관리하고 적절한 조치를 취하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 필터 섹션 */}
              <form
                onSubmit={handleSearch}
                className="mb-6 flex flex-wrap gap-4"
              >
                <div className="min-w-[200px] flex-1">
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange('status', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">모든 상태</SelectItem>
                      <SelectItem value="PENDING">처리 대기중</SelectItem>
                      <SelectItem value="RESOLVED">해결됨</SelectItem>
                      <SelectItem value="REJECTED">거부됨</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[200px] flex-1">
                  <Select
                    value={filters.type}
                    onValueChange={(value) => handleFilterChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">모든 유형</SelectItem>
                      <SelectItem value="HARASSMENT">괴롭힘</SelectItem>
                      <SelectItem value="SPAM">스팸</SelectItem>
                      <SelectItem value="INAPPROPRIATE">
                        부적절한 내용
                      </SelectItem>
                      <SelectItem value="HATE_SPEECH">혐오 발언</SelectItem>
                      <SelectItem value="THREAT">위협</SelectItem>
                      <SelectItem value="PERSONAL_INFO">
                        개인정보 유출
                      </SelectItem>
                      <SelectItem value="OTHER">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[200px] flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? (
                          filters.dateTo ? (
                            <>
                              {format(filters.dateFrom, 'yyyy-MM-dd')} ~{' '}
                              {format(filters.dateTo, 'yyyy-MM-dd')}
                            </>
                          ) : (
                            format(filters.dateFrom, 'yyyy-MM-dd')
                          )
                        ) : (
                          '날짜 선택'
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="range"
                        selected={{
                          from: filters.dateFrom ?? undefined,
                          to: filters.dateTo ?? undefined,
                        }}
                        onSelect={(range) =>
                          setFilters((prev) => ({
                            ...prev,
                            dateFrom: range?.from || null,
                            dateTo: range?.to || null,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="min-w-[300px] flex-1">
                  <div className="flex gap-2">
                    <Input
                      placeholder="사용자 ID, 신고 내용 검색..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                    />
                    <Button type="submit">
                      <Search className="mr-2 h-4 w-4" />
                      검색
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFilters({
                          status: 'ALL',
                          type: 'ALL',
                          dateFrom: null,
                          dateTo: null,
                          search: '',
                        });
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      초기화
                    </Button>
                  </div>
                </div>
              </form>

              {/* 테이블 */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>날짜</TableHead>
                      <TableHead>신고자</TableHead>
                      <TableHead>신고 대상</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center">
                          <div className="flex justify-center">
                            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            데이터 로딩 중...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : reports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center">
                          <div className="text-sm text-gray-500">
                            신고 내역이 없습니다.
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            {report.id}
                          </TableCell>
                          <TableCell>
                            {format(new Date(report.created_at), 'yyyy-MM-dd')}
                          </TableCell>
                          <TableCell>{report.reporter_name}</TableCell>
                          <TableCell>{report.reported_user_name}</TableCell>
                          <TableCell>
                            {getReportTypeText(report.type)}
                          </TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(report)}
                            >
                              상세보기
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* 페이지네이션 */}
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.currentPage > 1) {
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: prev.currentPage - 1,
                          }));
                        }
                      }}
                      className={cn(
                        pagination.currentPage <= 1 &&
                          'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPagination((prev) => ({
                                ...prev,
                                currentPage: pageNumber,
                              }));
                            }}
                            isActive={pagination.currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  {pagination.totalPages > 5 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        ...
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.currentPage < pagination.totalPages) {
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: prev.currentPage + 1,
                          }));
                        }
                      }}
                      className={cn(
                        pagination.currentPage >= pagination.totalPages &&
                          'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 통계 탭 */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>신고 통계</CardTitle>
              <CardDescription>
                신고 동향 및 유형별 분석을 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics ? (
                <div className="space-y-6">
                  {/* 요약 카드 */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {metrics.totalReports}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            총 신고
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {metrics.pendingReports}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            처리 대기중
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {metrics.resolvedReports}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            해결됨
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {metrics.falseReports}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            오신고
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 차트 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>일별 신고 추이</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ReportMetricsChart data={metrics.reportsByDate} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 유형별 통계 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>유형별 신고 통계</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Object.entries(metrics.reportsByType).map(
                          ([type, count]) => (
                            <div
                              key={type}
                              className="flex items-center justify-between rounded-md border p-4"
                            >
                              <div>{getReportTypeText(type as ReportType)}</div>
                              <Badge variant="secondary">{count}</Badge>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  <div className="mt-4 text-sm text-gray-500">
                    통계 데이터 로딩 중...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 신고 상세 다이얼로그 */}
      {selectedReport && (
        <ReportDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          report={selectedReport}
          onActionComplete={fetchReports}
        />
      )}
    </div>
  );
}
