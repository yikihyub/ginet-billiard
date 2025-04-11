'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import PopupTable from '../../_components/popup/popup-table';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// 팝업 데이터 타입 정의
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

// 폼 유효성 검사 스키마 정의
const popupFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  image_url: z.string().optional(),
  link_url: z
    .string()
    .url('유효한 URL을 입력해주세요.')
    .optional()
    .or(z.literal('')),
  start_date: z.date(),
  end_date: z.date(),
  is_active: z.boolean().default(true),
  width: z
    .number()
    .min(100, '최소 너비는 100px입니다.')
    .max(1000, '최대 너비는 1000px입니다.'),
  height: z
    .number()
    .min(100, '최소 높이는 100px입니다.')
    .max(1000, '최대 높이는 1000px입니다.'),
  position: z.string(),
  show_once: z.boolean().default(false),
  display_on: z.string(),
  order: z.number().default(0),
});

export default function PopupPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentPopup, setCurrentPopup] = useState<Popup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  // 폼 초기화
  const form = useForm<z.infer<typeof popupFormSchema>>({
    resolver: zodResolver(popupFormSchema),
    defaultValues: {
      title: '',
      content: '',
      image_url: '',
      link_url: '',
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 일주일 후
      is_active: true,
      width: 400,
      height: 300,
      position: 'center',
      show_once: false,
      display_on: 'client',
      order: 0,
    },
  });

  // 팝업 목록 불러오기
  const fetchPopups = async () => {
    try {
      const response = await fetch('/api/popup/allpopup');
      const data = await response.json();
      setPopups(data);
    } catch (error) {
      console.error('팝업 목록을 불러오는데 실패했습니다:', error);
      toast({
        variant: 'destructive',
        title: '에러 발생',
        description: '팝업 목록을 불러오는데 실패했습니다.',
      });
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  // 팝업 추가/수정 폼 제출 핸들러
  const onSubmit = async (values: z.infer<typeof popupFormSchema>) => {
    try {
      const url = isEditing
        ? `/api/popup/${currentPopup?.id}/updatepopup`
        : '/api/popup/postpopup';
      const method = isEditing ? 'UPDATE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: '성공',
          description: isEditing
            ? '팝업이 수정되었습니다.'
            : '팝업이 추가되었습니다.',
        });
        setIsDialogOpen(false);
        fetchPopups();
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || '요청 처리 중 오류가 발생했습니다.'
        );
      }
    } catch (error) {
      console.error('팝업 저장 중 오류:', error);
      toast({
        variant: 'destructive',
        title: '에러 발생',
        description: '팝업을 저장하는데 실패했습니다.',
      });
    }
  };

  // 팝업 삭제 핸들러
  const handleDeletePopup = async (id: string) => {
    if (!confirm('정말로 이 팝업을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/popup/${id}/deletepopup`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: '성공',
          description: '팝업이 삭제되었습니다.',
        });
        fetchPopups();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('팝업 삭제 중 오류:', error);
      toast({
        variant: 'destructive',
        title: '에러 발생',
        description: '팝업을 삭제하는데 실패했습니다.',
      });
    }
  };

  // 팝업 편집 모드 진입
  const handleEditPopup = (popup: Popup) => {
    setCurrentPopup(popup);
    setIsEditing(true);

    form.reset({
      title: popup.title,
      content: popup.content,
      image_url: popup.image_url || '',
      link_url: popup.link_url || '',
      start_date: new Date(popup.start_date),
      end_date: new Date(popup.end_date),
      is_active: popup.is_active,
      width: popup.width,
      height: popup.height,
      position: popup.position,
      show_once: popup.show_once,
      display_on: popup.display_on,
      order: popup.order,
    });

    setIsDialogOpen(true);
  };

  // 팝업 미리보기
  const handlePreviewPopup = (popup: Popup) => {
    setCurrentPopup(popup);
    setIsPreviewOpen(true);
  };

  // 폼 초기화
  const resetForm = () => {
    form.reset({
      title: '',
      content: '',
      image_url: '',
      link_url: '',
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      is_active: true,
      width: 400,
      height: 300,
      position: 'center',
      show_once: false,
      display_on: 'client',
      order: 0,
    });
    setCurrentPopup(null);
    setIsEditing(false);
  };

  // 새 팝업 추가 모달 열기
  const handleAddNewPopup = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">팝업 관리</h1>
        <Button onClick={handleAddNewPopup}>
          <Plus className="mr-2 h-4 w-4" />새 팝업 추가
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">활성 팝업</TabsTrigger>
          <TabsTrigger value="inactive">비활성 팝업</TabsTrigger>
          <TabsTrigger value="all">전체 팝업</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <PopupTable
            popups={popups.filter((p) => p.is_active)}
            onEdit={handleEditPopup}
            onDelete={handleDeletePopup}
            onPreview={handlePreviewPopup}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <PopupTable
            popups={popups.filter((p) => !p.is_active)}
            onEdit={handleEditPopup}
            onDelete={handleDeletePopup}
            onPreview={handlePreviewPopup}
          />
        </TabsContent>

        <TabsContent value="all">
          <PopupTable
            popups={popups}
            onEdit={handleEditPopup}
            onDelete={handleDeletePopup}
            onPreview={handlePreviewPopup}
          />
        </TabsContent>
      </Tabs>

      {/* 팝업 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? '팝업 수정' : '새 팝업 추가'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? '팝업 정보를 수정하세요.'
                : '새로운 팝업의 정보를 입력하세요.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input placeholder="팝업 제목" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_on"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>표시 위치</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="표시 위치 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="client">클라이언트</SelectItem>
                          <SelectItem value="admin">관리자</SelectItem>
                          <SelectItem value="both">모두</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>내용</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="팝업 내용"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이미지 URL (선택사항)</FormLabel>
                      <FormControl>
                        <Input placeholder="이미지 URL" {...field} />
                      </FormControl>
                      <FormDescription>
                        팝업에 표시할 이미지 URL을 입력하세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>링크 URL (선택사항)</FormLabel>
                      <FormControl>
                        <Input placeholder="링크 URL" {...field} />
                      </FormControl>
                      <FormDescription>
                        팝업 클릭 시 이동할 URL을 입력하세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>시작일</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>종료일</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>너비 (px)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>높이 (px)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>위치</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="위치 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="center">중앙</SelectItem>
                          <SelectItem value="top-left">좌측 상단</SelectItem>
                          <SelectItem value="top-right">우측 상단</SelectItem>
                          <SelectItem value="bottom-left">좌측 하단</SelectItem>
                          <SelectItem value="bottom-right">
                            우측 하단
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>순서</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        숫자가 작을수록 먼저 표시됩니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>활성화</FormLabel>
                        <FormDescription>
                          팝업의 활성화 여부를 설정합니다.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="show_once"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>1회 표시</FormLabel>
                        <FormDescription>
                          사용자당 한 번만 팝업을 표시합니다.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit">저장</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 팝업 미리보기 다이얼로그 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent
          className="overflow-hidden p-0"
          style={{
            width: currentPopup?.width || 400,
            height: currentPopup?.height || 300,
          }}
        >
          {currentPopup && (
            <div className="relative h-full w-full">
              {currentPopup.image_url && (
                <img
                  src={currentPopup.image_url}
                  alt={currentPopup.title}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent p-4">
                <h3 className="text-lg font-bold text-white">
                  {currentPopup.title}
                </h3>
                <p className="mt-2 text-white/90">{currentPopup.content}</p>
                {currentPopup.link_url && (
                  <div className="absolute bottom-4 right-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      자세히 보기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
