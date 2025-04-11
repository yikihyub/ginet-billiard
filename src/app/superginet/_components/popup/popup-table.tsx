'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Popup {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  link_url?: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  width: number;
  height: number;
  position: string;
  show_once: boolean;
  created_at: Date;
  updated_at: Date;
  display_on: 'client' | 'admin' | 'both';
  order: number;
}

interface PopupTableProps {
  popups: Popup[];
  onEdit: (popup: Popup) => void;
  onDelete: (id: string) => void;
  onPreview: (popup: Popup) => void;
}

export default function PopupTable({
  popups,
  onEdit,
  onDelete,
  onPreview,
}: PopupTableProps) {
  if (popups.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">표시할 팝업이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>기간</TableHead>
              <TableHead>크기</TableHead>
              <TableHead>위치</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>표시</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {popups.map((popup) => (
              <TableRow key={popup.id}>
                <TableCell className="font-medium">{popup.title}</TableCell>
                <TableCell>
                  {format(new Date(popup.start_date), 'yyyy-MM-dd')} ~
                  {format(new Date(popup.end_date), 'yyyy-MM-dd')}
                </TableCell>
                <TableCell>
                  {popup.width} × {popup.height}
                </TableCell>
                <TableCell>
                  {popup.position === 'center' && '중앙'}
                  {popup.position === 'top-left' && '좌측 상단'}
                  {popup.position === 'top-right' && '우측 상단'}
                  {popup.position === 'bottom-left' && '좌측 하단'}
                  {popup.position === 'bottom-right' && '우측 하단'}
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      popup.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {popup.is_active ? '활성' : '비활성'}
                  </span>
                </TableCell>
                <TableCell>
                  {popup.display_on === 'client' && '클라이언트'}
                  {popup.display_on === 'admin' && '관리자'}
                  {popup.display_on === 'both' && '모두'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPreview(popup)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(popup)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(popup.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
