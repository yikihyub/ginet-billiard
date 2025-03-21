'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MatchResultFormProps {
  matchId: number;
  player1Id: string;
  player2Id: string;
  onResultSubmitted?: () => void;
}

export default function MatchResultForm({
  matchId,
  player1Id,
  player2Id,
  onResultSubmitted,
}: MatchResultFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    winner_id: '',
    winner_score: '',
    loser_score: '',
    game_duration: '',
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/match/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_id: matchId,
          submitter_id: player1Id, // 현재 로그인한 사용자 ID
          winner_id: formData.winner_id,
          loser_id: formData.winner_id === player1Id ? player2Id : player1Id,
          winner_score: parseInt(formData.winner_score),
          loser_score: parseInt(formData.loser_score),
          game_duration: parseInt(formData.game_duration),
        }),
      });

      if (!response.ok) {
        throw new Error('결과 제출에 실패했습니다.');
      }

      setIsOpen(false);
      if (onResultSubmitted) {
        onResultSubmitted();
      }
    } catch (error) {
      console.error('결과 제출 오류:', error);
      alert('결과 제출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>경기 결과 입력</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>경기 결과 입력</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              승자
            </label>
            <select
              value={formData.winner_id}
              onChange={(e) =>
                setFormData({ ...formData, winner_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">승자 선택</option>
              <option value={player1Id}>Player 1</option>
              <option value={player2Id}>Player 2</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                승자 점수
              </label>
              <Input
                type="number"
                value={formData.winner_score}
                onChange={(e) =>
                  setFormData({ ...formData, winner_score: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                패자 점수
              </label>
              <Input
                type="number"
                value={formData.loser_score}
                onChange={(e) =>
                  setFormData({ ...formData, loser_score: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              게임 시간 (분)
            </label>
            <Input
              type="number"
              value={formData.game_duration}
              onChange={(e) =>
                setFormData({ ...formData, game_duration: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? '제출 중...' : '결과 제출'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
