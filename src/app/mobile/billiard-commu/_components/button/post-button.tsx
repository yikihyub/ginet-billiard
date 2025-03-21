'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function WriteButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleWritePost = () => {
    if (!session) {
      toast({ title: '로그인이 필요한 기능입니다.' });
      return;
    }

    router.push('/mobile/billiard-commu/main/write');
  };

  return (
    <button
      className="fixed bottom-8 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg"
      onClick={handleWritePost}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5V19M5 12H19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
