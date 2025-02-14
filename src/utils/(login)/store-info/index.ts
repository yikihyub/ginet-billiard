// 사업자등록번호 형식 검증
export const validateBusinessNumber = (number: string) => {
  const regex = /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/;
  return regex.test(number);
};

// 전화번호 형식 검증
export const validatestoreNumber = (phone: string) => {
  const regex = /^(0\d{1,2})-(\d{3,4})-(\d{4})$/;
  return regex.test(phone);
};
