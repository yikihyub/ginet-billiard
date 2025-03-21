import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      phonenum: string;
      mb_id: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      bi_level?: sring | null;
    } & DefaultSession['user'];
  }
}
