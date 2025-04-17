'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface BlockedButtonProps {
  blockedId: string;
}

const BlockedButton = ({ blockedId }: BlockedButtonProps) => {
  const unblockUser = async (blockedId: string) => {
    try {
      const response = await fetch(
        `/api/member/deleteblock?blockedId=${blockedId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '차단 해제에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('차단 해제 중 오류:', error);
      throw error;
    }
  };
  return (
    <Button
      variant="outline"
      onClick={() => unblockUser(blockedId)}
      className="bg-green-700 text-sm text-white"
    >
      차단 해제
    </Button>
  );
};

export default BlockedButton;
