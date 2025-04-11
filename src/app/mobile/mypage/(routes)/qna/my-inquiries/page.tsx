import React from 'react';
import { authOptions } from '@/config/authOptions';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'; // ← Shadcn 경로 기준

export default async function MyInquiriesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const inquiries = await prisma.bi_inquiry.findMany({
    where: {
      user_id: session.user.mb_id,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className="p-4">
      {inquiries.length === 0 ? (
        <p className="text-gray-500">문의 내역이 없습니다.</p>
      ) : (
        <Accordion type="multiple" className="w-full">
          {inquiries.map((inquiry) => (
            <AccordionItem key={inquiry.id} value={inquiry.id}>
              <AccordionTrigger className="flex justify-between">
                <span className="truncate text-sm font-medium">
                  {inquiry.subject}
                </span>
                <span
                  className={`ml-auto rounded-full px-2 py-1 text-xs ${
                    inquiry.status === 'answered'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {inquiry.status === 'answered' ? '답변완료' : '답변대기중'}
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2 text-sm text-gray-700">
                <p>{inquiry.message}</p>
                <p className="text-xs text-gray-500">
                  등록일: {inquiry.created_at.toISOString().slice(0, 10)}
                </p>

                {inquiry.status === 'answered' && inquiry.answer && (
                  <div className="rounded bg-green-50 p-3 text-sm">
                    <p className="mb-1 text-xs text-gray-500">
                      답변일: {inquiry.answered_at?.toISOString().slice(0, 10)}
                    </p>
                    <p>{inquiry.answer}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
