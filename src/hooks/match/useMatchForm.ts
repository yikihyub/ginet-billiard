// 'use client';

// import { useState } from 'react';
// import { useToast } from '@/hooks/use-toast';
// import { FormData, Store } from '@/types/(match)';

// interface UseMatchFormProps {
//   userId: string;
//   onSuccess?: () => void;
// }

// export const useMatchForm = ({ userId, onSuccess }: UseMatchFormProps) => {
//   const toast = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [accountSelectedValue, setAccountSelectedValue] =
//     useState('ONE_VS_ONE');
//   const [gameSelectedValue, setGameSelectedValue] = useState('FOUR_BALL');
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [selectedTime, setSelectedTime] = useState<string>('');

//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     phone: '',
//     handicap: '',
//     agreeToTerms: false,
//     store: null,
//   });

//   const updateFormField = (name: keyof FormData, value: any) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     if (
//       !formData.name ||
//       !formData.phone ||
//       !formData.handicap ||
//       !formData.store
//     ) {
//       showError('입력 오류', '모든 필수 항목을 입력해주세요.');
//       return false;
//     }
//     if (!formData.agreeToTerms) {
//       showError('약관 동의 필요', '개인정보 활용에 동의해주세요.');
//       return false;
//     }
//     if (!selectedDate || !selectedTime) {
//       showError('날짜/시간 선택', '매칭 날짜와 시간을 선택해주세요.');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     try {
//       setIsLoading(true);

//       if (!validateForm()) return;

//       const response = await submitMatchData({
//         userId,
//         matchType: accountSelectedValue,
//         gameType: gameSelectedValue,
//         playerInfo: {
//           name: formData.name,
//           phone: formData.phone,
//           handicap: parseInt(formData.handicap),
//           storeAddress: formData.store.address,
//         },
//         matchDateTime: combineDateAndTime(selectedDate!, selectedTime),
//       });

//       toast.toast({
//         title: '등록 완료',
//         description: '매치가 성공적으로 등록되었습니다!',
//       });

//       onSuccess?.();
//     } catch (error) {
//       handleSubmitError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     formState: {
//       formData,
//       accountSelectedValue,
//       gameSelectedValue,
//       selectedDate,
//       selectedTime,
//       isLoading,
//     },
//     formActions: {
//       updateFormField,
//       setAccountSelectedValue,
//       setGameSelectedValue,
//       setSelectedDate,
//       setSelectedTime,
//       handleSubmit,
//     },
//   };
// };
