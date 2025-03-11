'use client';

import { Phone, Mail } from 'lucide-react';
import { InfoTabProps } from '@/types/(club)/club';
import MapView from '../kakaomap/map-view';

export function InfoTab({ clubData }: InfoTabProps) {
  return (
    <div className="space-y-6">
      {/* 동호회 소개 */}
      <div>
        <h3 className="mb-2 font-semibold">동호회 소개</h3>
        <p className="text-sm leading-relaxed text-gray-600">
          {clubData.description}
        </p>
      </div>

      {/* 동호회 규칙 */}
      <div>
        <h3 className="mb-2 font-semibold">동호회 규칙</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {clubData.rules &&
            clubData.rules.map((rule, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{rule}</span>
              </li>
            ))}
        </ul>
      </div>

      {/* 활동 장소 */}
      <div>
        <h3 className="mb-2 font-semibold">활동 장소</h3>
        <div className="bg-white-50 rounded-lg border p-3">
          <p className="text-sm font-medium">{clubData.venue.name}</p>
          <p className="mt-1 text-sm text-gray-600">{clubData.venue.address}</p>
          <div className="mt-2 h-[40vh] w-full overflow-hidden rounded-lg bg-white">
            <MapView
              address={clubData.venue.address}
              placeName={clubData.venue.name}
              height="100%"
            />
          </div>
        </div>
      </div>

      {/* 문의하기 */}
      <div>
        <h3 className="mb-2 font-semibold">문의하기</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-gray-500" />
            <span>{clubData.contact.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4 text-gray-500" />
            <span>{clubData.contact.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
