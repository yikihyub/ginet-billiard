'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../badge/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  getGameTypeLabel,
  getMatchTypeLabel,
} from '@/utils/(match)/match-utils';

import { MatchCardProps } from '../../../_types';
import { MapPinIcon, CalendarIcon } from 'lucide-react';

export function MatchCard({
  player,
  userId,
  isProcessing,
  onMatchRequest,
}: MatchCardProps) {
  console.log(player);
  return (
    <Card key={player.id} className="overflow-hidden border-none shadow-md">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={'/logo/billiard-ball.png'}
                alt={player.bi_user?.name || '사용자'}
              />
              <AvatarFallback>
                {player.bi_user?.name ? player.bi_user.name.slice(0, 2) : '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">
                {player.bi_user?.name || '이름 없음'}
              </div>
            </div>
          </div>
          <div>
            <StatusBadge status={player.status} />
          </div>
        </div>

        <div className="mt-2 space-y-2 text-sm">
          <div className="flex divide-x divide-border text-center text-sm">
            {/* 왼쪽 박스 */}
            <div className="flex-1 px-4">
              <div className="font-medium text-muted-foreground">게임 유형</div>
              <div className="mt-1 text-black">
                {getGameTypeLabel(player.game_type)}
              </div>
            </div>

            {/* 가운데 박스 */}
            <div className="flex-1 px-4">
              <div className="font-medium text-muted-foreground">매치 유형</div>
              <div className="mt-1 text-black">
                {getMatchTypeLabel(player.match_type)}
              </div>
            </div>

            {/* 오른쪽 박스 */}
            <div className="flex-1 px-4">
              <div className="font-medium text-muted-foreground">당구 수지</div>
              <div className="mt-1 text-black">1{player.handicap}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-gray-50 p-4">
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="mr-1 h-4 w-4" />
              <span className="truncate" title={player.billiard_place || ''}>
                매칭장소 : {player.billiard_place || '장소 미정'}
              </span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>
                등록날짜 :&nbsp;
                {new Date(player.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {userId !== player.bi_user.mb_id && player.status === 'PENDING' && (
          <div className="mt-4">
            <Button
              onClick={() => onMatchRequest(player)}
              disabled={isProcessing}
              size="lg"
              className="h-12 w-full bg-green-600 text-white"
            >
              {isProcessing ? '처리중...' : '매치 신청'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
