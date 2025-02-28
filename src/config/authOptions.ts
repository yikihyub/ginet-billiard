import type { AuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        user_id: {
          label: '이메일',
          type: 'email',
          placeholder: '이메일 주소 입력 요망',
        },
        userpw: { label: '비밀번호', type: 'password' },
      },

      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: credentials?.user_id,
              userpw: credentials?.userpw,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || '서버 오류가 발생했습니다');
        }

        const user = await res.json();
        if (!user) {
          throw new Error('사용자 정보를 찾을 수 없습니다');
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...(user ?? {}) };
    },

    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any;
      return session;
    },
  },

  // secret 추가
  secret: process.env.NEXTAUTH_SECRET,

  // session 설정 추가
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  pages: {
    signIn: '/',
  },
};
