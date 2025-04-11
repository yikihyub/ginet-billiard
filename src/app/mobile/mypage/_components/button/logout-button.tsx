'use client';

import React from 'react';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogOutButton() {
  return (
    <>
      <Button
        onClick={() => signOut({ callbackUrl: '/' })}
        variant="ghost"
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        로그아웃
      </Button>
    </>
  );
}
