'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import ImageSlider from './_components/image-slider';
import BasicInfo from './_components/basic-info';
import FacilityInfo from './_components/facility-info';
import ReserveButton from './_components/reserve-button';
import IntroInfo from './_components/intro-info';
import { TimeTable } from './_components/timetable';
import NoticeInfoPage from './_components/notice-info';

import { Store } from '@/types/(reserve)';

export default function MobileDetailPage() {
  const { id } = useParams();
  const [store, setStore] = useState<Store>({
    longitude: '',
    latitude: '',
    id: 0,
    name: '',
    open_time: '',
    close_time: '',
  });
  const [loading, setLoading] = useState(true);

  if (loading) {
    <div>loading...</div>;
  }

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`/api/store/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch store data');
        }
        const data = await response.json();

        setStore(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  const daytimes = store
    ? [
        {
          yoil: '월요일',
          time: `${store.open_time} ~ ${store.close_time}`,
          originalPrice: store.hourly_rate || 0,
        },
        {
          yoil: '화요일',
          time: `${store.open_time} ~ ${store.close_time}`,
          originalPrice: store.hourly_rate || 0,
        },
        {
          yoil: '수요일',
          time: `${store.open_time} ~ ${store.close_time}`,
          originalPrice: store.hourly_rate || 0,
        },
        {
          yoil: '목요일',
          time: `${store.open_time} ~ ${store.close_time}`,
          originalPrice: store.hourly_rate || 0,
        },
        {
          yoil: '금요일',
          time: `${store.open_time} ~ ${store.close_time}`,
          originalPrice: store.hourly_rate || 0,
        },
      ]
    : [];

  const weektimes = store
    ? [
        {
          yoil: '토요일',
          time: `${store.saturday_open || store.open_time} ~ ${store.saturday_close || store.close_time}`,
          originalPrice: store.hourly_rate || 0,
          discountPrice: store.weekend_rate,
        },
        {
          yoil: '일요일',
          time: `${store.sunday_open || store.open_time} ~ ${store.sunday_close || store.close_time}`,
          originalPrice: store.hourly_rate || 0,
          discountPrice: store.weekend_rate,
        },
      ]
    : [];

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <ImageSlider />
        <BasicInfo store={store} />
        <IntroInfo store={store} />
        <TimeTable dayTimes={daytimes} weekendTimes={weektimes} />
        <FacilityInfo />
        <NoticeInfoPage />
      </div>
      <ReserveButton store={store} />
    </div>
  );
}
