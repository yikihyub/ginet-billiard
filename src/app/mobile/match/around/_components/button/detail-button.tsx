'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EllipsisVertical,
  ShieldOff, // 👈 차단
  AlertOctagon, // 👈 신고
  User,
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer-custom';
import { Button } from '@/components/ui/button';

import BlockModal from '../modal/block-modal';

const UserActionsDrawer = ({
  userId,
  username,
  moveUrl,
}: {
  userId: string;
  username: string;
  moveUrl: () => void;
}) => {
  const router = useRouter();
  const [blockOpen, setBlockOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>('viewProfile');

  console.log(selected);

  const handleAction = (type: string) => {
    if (type === 'viewProfile') moveUrl();
    if (type === 'block') return setBlockOpen(true);
    if (type === 'report') {
      router.push(`/mobile/match/around/report-user?userId=${userId}`);
      return;
    }

    setSelected(type);
    setOpen(false);
  };

  const actions = [
    { key: 'viewProfile', icon: User, label: '프로필' },
    { key: 'block', icon: ShieldOff, label: '차단하기' }, // 변경됨
    { key: 'report', icon: AlertOctagon, label: '신고하기' }, // 변경됨
  ];

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <EllipsisVertical className="h-5 w-5 cursor-pointer" />
        </DrawerTrigger>
        <DrawerContent className="rounded-t-2xl bg-gray-50 p-4">
          <DrawerHeader>
            <DrawerTitle className="text-center text-base font-semibold"></DrawerTitle>
          </DrawerHeader>

          <ul className="divide-y text-center text-base font-medium text-gray-800">
            {actions.map((action) => (
              <li
                key={action.key}
                className="relative flex cursor-pointer items-center justify-center px-4 py-6 font-bold active:bg-gray-100"
                onClick={() => handleAction(action.key)}
              >
                <action.icon className="mr-2 h-5 w-5 text-gray-600" />
                {action.label}
              </li>
            ))}
          </ul>

          {/* 취소 버튼 */}
          <DrawerClose asChild>
            <Button className="mt-4 h-16 bg-green-700 text-lg font-bold">
              닫기
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      <BlockModal
        open={blockOpen}
        onConfirm={() => {
          setBlockOpen(false);
          setOpen(false);
        }}
        onClose={() => setBlockOpen(false)}
        userId={userId}
        userName={username}
      />
    </>
  );
};

export default UserActionsDrawer;
