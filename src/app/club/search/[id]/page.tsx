'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ClubHeader from './_components/club/club-header';
import ClubInfo from './_components/club/club-info';
import ClubTabs from './_components/club/club-tabs';
import ClubTabContent from './_components/club/club-content';
import ClubCommunicationButtons from './_components/button/communication-button';

import { FrontClubData } from '@/types/(club)/club';
import { ClubData } from '@/types/(club)/db-club';

export default function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>('info');
  const [backClubData, setbackClubData] = useState<ClubData | null>(null);
  const [frontClubData, setFrontClubData] = useState<FrontClubData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  console.log(backClubData);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const response = await fetch(`/api/club/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch club data');
        }
        const data = await response.json();
        setFrontClubData(data);
        setbackClubData(data);

        console.log(data.isAdmin);

        setIsAdmin(data.isAdmin || false);
      } catch (error) {
        console.error('Error fetching club data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClubData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (!frontClubData) {
    return (
      <div className="flex h-screen items-center justify-center">
        동호회 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-2">
      <ClubHeader clubData={frontClubData} />
      <ClubInfo clubData={frontClubData} clubId={id} isAdmin={isAdmin} />
      <ClubTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ClubTabContent activeTab={activeTab} clubData={frontClubData} />
      <ClubCommunicationButtons id={id} />
    </div>
  );
}
