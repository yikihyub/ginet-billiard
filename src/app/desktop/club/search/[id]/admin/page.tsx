'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Users,
  CalendarDays,
  Bell,
  Settings,
  Shield,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { ClubData } from '@/types/(club)/db-club';

export default function ClubAdminPage() {
  const [activeTab, setActiveTab] = useState('members');
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 클럽 데이터 및 관리자 권한 확인
  useEffect(() => {
    const fetchClubData = async () => {
      try {
        setIsLoading(true);

        // 클럽 데이터 가져오기
        const clubResponse = await fetch(`/api/club/${id}`);
        if (!clubResponse.ok) {
          throw new Error('클럽 데이터를 불러오는데 실패했습니다.');
        }
        const clubData = await clubResponse.json();
        setClubData(clubData);
        setIsAdmin(clubData.isAdmin);
        // 관리자 권한 확인

        if (isAdmin) {
          setIsAdmin(false);
          // 관리자가 아닌 경우 클럽 메인 페이지로 리디렉션
          router.push(`/club/search/${id}`);
          return;
        }

        // 관리자인 경우 가입 요청 목록 가져오기
        await fetchJoinRequests();
      } catch (error) {
        console.error('Error loading admin page:', error);
        router.push(`/club/search/${id}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchClubData();
    }
  }, [id, router]);

  const fetchJoinRequests = async () => {
    try {
      const response = await fetch(`/api/club/${id}/getjoinrequests`);
      if (response.ok) {
        const data = await response.json();
        setJoinRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching join requests:', error);
    }
  };

  // 가입 요청 승인/거절 처리
  const handleJoinRequest = async (
    requestId: number,
    status: 'approved' | 'rejected'
  ) => {
    try {
      const response = await fetch(`/api/club/${id}/postjoinrequests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, requestId, status }),
      });

      if (response.ok) {
        // 성공 처리
        fetchJoinRequests(); // 목록 새로고침
      }
    } catch (error) {
      console.error('Error handling join request:', error);
    }
  };

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <h2 className="text-xl font-semibold">로딩 중...</h2>
          <p className="text-gray-500">관리자 패널을 불러오고 있습니다</p>
        </div>
      </div>
    );
  }

  // 관리자가 아니거나 데이터가 없는 경우
  if (!isAdmin || !clubData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-500">
            접근 권한이 없습니다
          </h2>
          <p className="mb-4 text-gray-500">
            이 페이지는 동호회 관리자만 접근할 수 있습니다
          </p>
          <Link
            href={`/club/search/${id}`}
            className="inline-block rounded-lg bg-blue-500 px-4 py-2 font-medium text-white"
          >
            동호회 메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 p-4 text-white">
        <div className="mb-2">
          <Link
            href={`/club/search/${id}`}
            className="inline-flex items-center text-blue-100 hover:text-white"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>동호회로 돌아가기</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold">관리자 모드</h1>
        <p className="text-blue-100">{clubData.name} 관리</p>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white">
        <div className="flex overflow-x-auto border-b">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center space-x-1 px-4 py-3 ${
              activeTab === 'members'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>회원 관리</span>
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center space-x-1 px-4 py-3 ${
              activeTab === 'notices'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>공지사항</span>
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`flex items-center space-x-1 px-4 py-3 ${
              activeTab === 'schedules'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            <span>일정 관리</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-1 px-4 py-3 ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>설정</span>
          </button>
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="container mx-auto p-4">
        {/* 회원 관리 탭 */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* 가입 요청 섹션 */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">가입 요청</h2>

              {joinRequests.length > 0 ? (
                <div className="space-y-3">
                  {joinRequests.map((request) => (
                    <div
                      key={request.request_id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {request.user_name || request.user_id}
                        </p>
                        <p className="text-sm text-gray-500">
                          요청일:{' '}
                          {new Date(request.requested_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleJoinRequest(request.request_id, 'approved')
                          }
                          className="rounded-md bg-green-100 p-2 text-green-600 hover:bg-green-200"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleJoinRequest(request.request_id, 'rejected')
                          }
                          className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-gray-500">
                  새로운 가입 요청이 없습니다.
                </p>
              )}
            </div>

            {/* 회원 목록 섹션 */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">회원 목록</h2>
                <span className="text-sm text-gray-500">
                  {clubData.memberCount}/{clubData.memberLimit} 명
                </span>
              </div>

              {/* 운영진 리스트 */}
              <h3 className="mb-2 mt-4 font-medium">운영진</h3>
              <div className="space-y-2">
                {clubData.staff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">
                          {member.role} • {member.since}
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-gray-500 hover:text-blue-500">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <button className="flex w-full items-center justify-center space-x-1 rounded-md border border-dashed border-gray-300 p-3 text-gray-500 hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                  <span>운영진 추가</span>
                </button>
              </div>

              {/* 일반 회원 리스트 */}
              <h3 className="mb-2 mt-6 font-medium">일반 회원</h3>
              <div className="space-y-2">
                {clubData.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">
                        가입일: {new Date(member.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-blue-500">
                        <Shield className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 공지사항 탭 */}
        {activeTab === 'notices' && (
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">공지사항 관리</h2>
              <button className="flex items-center space-x-1 rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600">
                <Plus className="h-4 w-4" />
                <span>새 공지사항</span>
              </button>
            </div>

            <div className="space-y-3">
              {clubData.notices.map((notice) => (
                <div key={notice.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{notice.title}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {notice.content}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        작성일: {new Date(notice.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-blue-500">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {clubData.notices.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <Bell className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                  <p>등록된 공지사항이 없습니다.</p>
                  <p className="text-sm">새 공지사항을 작성해보세요.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 일정 관리 탭 */}
        {activeTab === 'schedules' && (
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">일정 관리</h2>
              <button className="flex items-center space-x-1 rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600">
                <Plus className="h-4 w-4" />
                <span>새 일정</span>
              </button>
            </div>

            <div className="space-y-3">
              {clubData.schedules.map((schedule) => (
                <div key={schedule.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            schedule.type === 'competition'
                              ? 'bg-orange-500'
                              : 'bg-blue-500'
                          }`}
                        ></span>
                        <p className="font-medium">{schedule.title}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        장소: {schedule.location}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        일시: {schedule.date} {schedule.time}
                        {schedule.endTime && ` - ${schedule.endTime}`}
                      </p>
                      {schedule.details && schedule.details.length > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                          {schedule.details.join(' ')}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-blue-500">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {clubData.schedules.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <CalendarDays className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                  <p>등록된 일정이 없습니다.</p>
                  <p className="text-sm">새 일정을 추가해보세요.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 설정 탭 */}
        {activeTab === 'settings' && (
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">동호회 설정</h2>

            <form className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  동호회 이름
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2"
                  defaultValue={clubData.name}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  동호회 소개
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-2"
                  rows={4}
                  defaultValue={clubData.description}
                ></textarea>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  활동 지역
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2"
                  defaultValue={clubData.location}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  정기 모임 일정
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2"
                  defaultValue={clubData.meetingSchedule}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  최대 회원 수
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-gray-300 p-2"
                  defaultValue={clubData.memberLimit}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  동호회 규칙
                </label>
                <div className="space-y-2">
                  {clubData.rules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        className="flex-1 rounded-md border border-gray-300 p-2"
                        defaultValue={rule}
                      />
                      <button type="button" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="flex w-full items-center justify-center space-x-1 rounded-md border border-dashed border-gray-300 p-2 text-gray-500 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>규칙 추가</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  활동 장소
                </label>
                <input
                  type="text"
                  className="mb-2 w-full rounded-md border border-gray-300 p-2"
                  placeholder="장소 이름"
                  defaultValue={clubData.venue.name}
                />
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="주소"
                  defaultValue={clubData.venue.address}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  연락처
                </label>
                <input
                  type="text"
                  className="mb-2 w-full rounded-md border border-gray-300 p-2"
                  placeholder="전화번호"
                  defaultValue={clubData.contact.phone}
                />
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="이메일"
                  defaultValue={clubData.contact.email}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white hover:bg-blue-600"
                >
                  설정 저장하기
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
