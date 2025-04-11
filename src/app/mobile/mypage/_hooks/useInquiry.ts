'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type InquiryFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id?: string;
};

type InquiryListParams = {
  user_id?: string;
  isAdmin?: boolean;
  page?: number;
  limit?: number;
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  answer: string | null;
  answered_at: string;
  answered_by: string | null;
  user_id: string | null;
};

type PaginationData = {
  total: number;
  pages: number;
  page: number;
  limit: number;
};

export function useInquiry() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });

  // 문의 목록 가져오기
  const getInquiries = async (params: InquiryListParams = {}) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();
      if (params.user_id) queryParams.append('userId', params.user_id);
      if (params.isAdmin) queryParams.append('isAdmin', 'true');
      queryParams.append('page', String(params.page || 1));
      queryParams.append('limit', String(params.limit || 10));

      const response = await fetch(`/api/inquiries/getinquiries?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '문의 목록을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      
      setInquiries(data.inquiries);
      setPagination(data.pagination);
      
      return data;
    } catch (error: any) {
      toast({
        title: '오류',
        description: error.message || '문의 목록을 불러오는데 실패했습니다',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 문의 상세 정보 가져오기
  const getInquiryDetail = async (id: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/inquiries/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '문의 정보를 불러오는데 실패했습니다');
      }

      return await response.json();
    } catch (error: any) {
      toast({
        title: '오류',
        description: error.message || '문의 정보를 불러오는데 실패했습니다',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 문의 등록하기
  const createInquiry = async (data: InquiryFormData) => {

    try {
      setLoading(true);

      const response = await fetch('/api/inquiries/postinquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '문의 등록에 실패했습니다');
      }

      const result = await response.json();
      
      toast({
        title: '문의 등록 완료',
        description: '문의가 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.',
      });
      
      router.refresh();
      return result;
    } catch (error: any) {
      toast({
        title: '문의 등록 실패',
        description: error.message || '문의 등록에 실패했습니다',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 문의 답변하기 (관리자용)
  const answerInquiry = async (id: string, answer: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/inquiries/${id}/updateinquiries`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '답변 등록에 실패했습니다');
      }

      const result = await response.json();
      
      toast({
        title: '답변 등록 완료',
        description: '문의에 대한 답변이 성공적으로 등록되었습니다.',
      });
      
      router.refresh();
      return result;
    } catch (error: any) {
      toast({
        title: '답변 등록 실패',
        description: error.message || '답변 등록에 실패했습니다',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 문의 삭제하기 (관리자용)
  const deleteInquiry = async (id: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '문의 삭제에 실패했습니다');
      }

      toast({
        title: '문의 삭제 완료',
        description: '문의가 성공적으로 삭제되었습니다.',
      });
      
      router.refresh();
      return await response.json();
    } catch (error: any) {
      toast({
        title: '문의 삭제 실패',
        description: error.message || '문의 삭제에 실패했습니다',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    inquiries,
    pagination,
    getInquiries,
    getInquiryDetail,
    createInquiry,
    answerInquiry,
    deleteInquiry,
  };
}