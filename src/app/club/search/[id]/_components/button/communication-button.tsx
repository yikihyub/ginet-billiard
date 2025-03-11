'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, CheckCircle, Clock, UserPlus } from 'lucide-react';
import { ClubCommunicationButtonsProps } from '@/types/(club)/club';

// 회원 상태 타입 정의
type MembershipStatus = 'none' | 'pending' | 'member';

export default function ClubCommunicationButtons({
  id,
}: ClubCommunicationButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [membershipStatus, setMembershipStatus] =
    useState<MembershipStatus>('none');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();

  // 컴포넌트 마운트 시 회원 상태 확인
  useEffect(() => {
    const checkMembershipStatus = async () => {
      try {
        setIsInitialLoading(true);

        const response = await fetch(`/api/club/join?clubId=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // 로그인이 필요한 경우 등은 에러로 처리하지 않고 기본 상태로 둠
          if (response.status === 401) {
            setMembershipStatus('none');
            return;
          }

          const data = await response.json();

          throw new Error(data.error || '상태 확인 중 오류가 발생했습니다.');
        }

        const data = await response.json();
        setMembershipStatus(data.status);
      } catch (error) {
        console.error('Error checking membership status:', error);
        // 에러 발생 시 기본값 유지
        setMembershipStatus('none');
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkMembershipStatus();
  }, [id]);

  const handleJoinClick = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // API 호출을 통한 가입 요청 처리
      const response = await fetch('/api/club/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '가입 신청 중 오류가 발생했습니다.');
      }

      alert('가입 신청이 완료되었습니다. 승인을 기다려주세요.');
      setMembershipStatus('pending');
      // router.refresh();
    } catch (error) {
      console.error('Error joining club:', error);

      if (error instanceof Error) {
        setError(error.message);

        // 로그인 필요 시 로그인 페이지로 리디렉션
        if (error.message === '로그인이 필요합니다.') {
          alert('로그인 후 이용해주세요.');
          router.push(
            '/login?redirect=' + encodeURIComponent(window.location.pathname)
          );
          return;
        }

        alert(error.message);
      } else {
        setError('가입 신청 중 오류가 발생했습니다.');
        alert('가입 신청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 회원 상태에 따른 버튼 렌더링
  const renderActionButton = () => {
    if (isInitialLoading) {
      return (
        <button
          disabled
          className="flex-1 rounded-lg bg-gray-300 px-3 py-2 text-sm font-semibold text-white shadow-lg"
        >
          <div className="flex items-center justify-center">
            <Clock className="mr-2 h-5 w-5 animate-pulse" />
            <span>로딩 중...</span>
          </div>
        </button>
      );
    }

    switch (membershipStatus) {
      case 'member':
        return (
          <button
            disabled
            className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-lg"
          >
            <div className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>회원</span>
            </div>
          </button>
        );
      case 'pending':
        return (
          <button
            disabled
            className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-lg"
          >
            <div className="flex items-center justify-center">
              <Clock className="mr-2 h-5 w-5" />
              <span>동호회 가입 승인 확인중...</span>
            </div>
          </button>
        );
      case 'none':
      default:
        return (
          <button
            onClick={handleJoinClick}
            disabled={isLoading}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-lg transition-colors ${
              isLoading
                ? 'cursor-not-allowed bg-green-300'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <div className="flex items-center justify-center">
              <UserPlus className="mr-2 h-5 w-5" />
              <span>{isLoading ? '처리 중...' : '가입 신청하기'}</span>
            </div>
          </button>
        );
    }
  };

  return (
    <div className="mt-2 bg-white p-4 shadow-sm">
      <div className="flex space-x-2">
        <button className="flex-1 rounded-lg border border-gray-300 py-3 font-medium">
          <Link href={`/club/search/${id}/chat`}>
            <div className="flex items-center justify-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              <span>채팅방</span>
            </div>
          </Link>
        </button>

        {renderActionButton()}
      </div>

      {error && (
        <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
