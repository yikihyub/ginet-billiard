'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Notice {
  id: number;
  title: string;
  date: string;
  published: boolean;
}

export default function AdminNoticePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Check if user is authenticated and is an admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (
      status === 'authenticated' &&
      session?.user?.bi_level !== 'ADMIN'
    ) {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch notices
  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await fetch('/api/notices/getnotice');
        if (!response.ok) throw new Error('Failed to fetch notices');

        const data = await response.json();

        const formattedNotices = data.map((notice: any) => ({
          id: notice.id,
          title: notice.title,
          date: format(new Date(notice.date), 'yyyy-MM-dd'),
          published: notice.published,
        }));

        setNotices(formattedNotices);
      } catch (error) {
        console.error('Error fetching notices:', error);
        toast({
          title: '오류',
          description: '공지사항을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated' && session?.user?.bi_level === 'ADMIN') {
      fetchNotices();
    }
  }, [status, session]);

  const handleCreate = () => {
    router.push('/superginet/content-manage/notice/create');
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/notice/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/notices/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notice');

      setNotices(notices.filter((notice) => notice.id !== deleteId));

      toast({
        title: '성공',
        description: '공지사항이 삭제되었습니다.',
      });
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast({
        title: '오류',
        description: '공지사항 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
      setDialogOpen(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">공지사항 관리</h1>
        <div>로딩 중...</div>
      </div>
    );
  }

  if (
    status === 'unauthenticated' ||
    (status === 'authenticated' && session?.user?.bi_level !== 'ADMIN')
  ) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> 새 공지사항
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>날짜</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-6 text-center">
                공지사항이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            notices.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>{notice.id}</TableCell>
                <TableCell className="font-medium">{notice.title}</TableCell>
                <TableCell>{notice.date}</TableCell>
                <TableCell>
                  <Badge variant={notice.published ? 'default' : 'outline'}>
                    {notice.published ? '게시됨' : '비공개'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(notice.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(notice.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
