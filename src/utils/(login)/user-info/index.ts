// 비밀번호 강도 검사 함수
export const checkPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;
  return strength;
};
// 비밀번호 강도 검사 함수
export const getPasswordStrengthText = (
  strength: number
): { text: string; color: string } => {
  if (strength === 0) return { text: '', color: 'gray' };
  if (strength <= 25) return { text: '매우 약함', color: 'red' };
  if (strength <= 50) return { text: '약함', color: 'orange' };
  if (strength <= 75) return { text: '보통', color: 'blue' };
  return { text: '강함', color: 'green' };
};

// 임시 API 함수 (실제 구현 시 이 부분을 실제 API 호출로 대체)
// export const checkEmailAvailability = async (
//   email: string
// ): Promise<boolean> => {
//   // 실제 API 호출로 대체해야 함
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // 테스트를 위해 특정 이메일은 사용 불가능하게 설정
//       resolve(!email.includes("taken"));
//     }, 1000);
//   });
// };

// 임시 API 함수들
/* eslint-disable @typescript-eslint/no-unused-vars */
export const sendVerificationCode = async (phone: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

//변환
/* eslint-disable @typescript-eslint/no-unused-vars */
export const verifyCode = async (
  phone: string,
  code: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(code === '1234'); // 테스트용 인증번호
    }, 1000);
  });
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string) => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};

export const validatePhone = (phone: string) => {
  const regex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
  return regex.test(phone);
};

// 이메일 중복 확인 API 호출
export const checkEmailAvailability = async (email: string) => {
  try {
    const response = await fetch('/api/check/emailcheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('이메일 중복 확인 요청 실패');
    }

    const data = await response.json();
    return data.isAvailable;
  } catch (error) {
    console.error('이메일 중복 확인 오류:', error);
    throw error;
  }
};

// 전화번호 중복 확인 API 호출
export const checkPhoneAvailability = async (phone: string) => {
  try {
    const response = await fetch('/api/check/phonecheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      throw new Error('전화번호 중복 확인 요청 실패');
    }

    const data = await response.json();
    return data.isAvailable;
  } catch (error) {
    console.error('전화번호 중복 확인 오류:', error);
    throw error;
  }
};

// 이름 중복 확인 API 호출
export const checkNameAvailability = async (name: string) => {
  try {
    const response = await fetch('/api/check/namecheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('이름 중복 확인 요청 실패');
    }

    const data = await response.json();
    return data.isAvailable;
  } catch (error) {
    console.error('이름 중복 확인 오류:', error);
    throw error;
  }
};

// 인증번호 발송 API 호출
// export const sendVerificationCode = async (phone: string) => {
//   try {
//     const response = await fetch('/api/send-verification-code', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ phone }),
//     });

//     if (!response.ok) {
//       throw new Error('인증번호 발송 요청 실패');
//     }

//     const data = await response.json();
//     return data.success;
//   } catch (error) {
//     console.error('인증번호 발송 오류:', error);
//     throw error;
//   }
// };
