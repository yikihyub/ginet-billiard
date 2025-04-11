'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

import { Loader2 } from 'lucide-react';
import { useInquiry } from '../../../_hooks/useInquiry';

export default function InquiryFormPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { loading, createInquiry } = useInquiry();

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const inquiryData = {
        name: session?.user?.name ?? '',
        email: session?.user?.email ?? '',
        subject: form.subject,
        message: form.message,
        userId: session?.user?.mb_id,
      };

      await createInquiry(inquiryData);

      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      toast({
        title: '문의 완료',
        description: '고객센터가 확인 후 연락드릴 예정입니다.',
      });
    } catch (error) {
      console.error('문의 등록 실패:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold">문의하기</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="subject">제목</Label>
          <Input
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="제목을 입력해주세요"
            className="h-12"
          />
        </div>

        <div>
          <Label htmlFor="message">문의내용</Label>
          <Textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="문의 내용을 입력해주세요"
            rows={12}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-12 w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              처리중...
            </>
          ) : (
            '문의 전송하기'
          )}
        </Button>
      </div>
    </div>
  );
}
