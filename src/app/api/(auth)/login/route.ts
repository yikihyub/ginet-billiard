import { signJwtAccessToken } from '@/config/jwt';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

interface RequestBody {
  user_id: string;
  userpw: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        mb_id: body.user_id,
      },
      select: {
        id: true,
        name: true,
        email:true,
        mb_id: true,
        password: true,
        phonenum: true,
        bi_level: true,
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: '등록되지 않은 사용자입니다.' }),
        { status: 400 }
      );
    }

    if (!user.password) {
      return new Response(
        JSON.stringify({ error: '비밀번호가 설정되지 않은 사용자입니다.' }),
        { status: 400 }
      );
    }

    const isPasswordValid = await compare(body.userpw, user.password);

    if (isPasswordValid) {
      // 클라이언트 IP 가져오기
      const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';

      // DB에 로그인 정보 업데이트 (IP 포함)
      await prisma.user.update({
        where: {
          mb_id: user.mb_id || '',
        },
        data: {
          mb_today_login: new Date(),
          mb_login_ip: clientIp, // IP 주소 저장
          mb_memo_cnt: { increment: 1 },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPass } = user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      // 세션에는 IP 제외하고 필수 정보만 포함
      const sessionData = {
        id: userWithoutPass.id,
        name: userWithoutPass.name,
        email: userWithoutPass.email,
        mb_id: userWithoutPass.mb_id,
        phonenum: userWithoutPass.phonenum,
        bi_level: userWithoutPass.bi_level,
      };

      const accessToken = signJwtAccessToken(sessionData);
      const result = {
        ...sessionData,
        accessToken,
      };

      return new Response(JSON.stringify(result, null, 2));
    }

    return new Response(
      JSON.stringify({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }),
      {
        status: 401,
      }
    );
  } catch (error) {
    console.error('로그인 오류:', error);
    return new Response(
      JSON.stringify({ error: '로그인 처리 중 오류가 발생했습니다.' }),
      {
        status: 500,
      }
    );
  }
}
