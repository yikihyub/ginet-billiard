import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const DEFAULT_SIGN_OPTION: SignOptions = {
  expiresIn: '1h' as const,
};

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOptions = DEFAULT_SIGN_OPTION
) {
  const secret_key = process.env.SECRET_KEY;
  const token = jwt.sign(payload, secret_key!, options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const secret_key = process.env.SECRET_KEY || 'default_secret';
    const decoded = jwt.verify(token, secret_key) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('JWT 검증 실패:', error);
    return null;
  }
}
