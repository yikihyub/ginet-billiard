// import webpush from 'web-push';
// import { prisma } from './prisma';

// // web-push 설정
// webpush.setVapidDetails(
//   'mailto:your-email@example.com',
//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
//   process.env.VAPID_PRIVATE_KEY || ''
// );

// /**
//  * 사용자에게 푸시 알림을 전송합니다.
//  * @param userId 알림을 받을 사용자 ID
//  * @param title 알림 제목
//  * @param message 알림 내용
//  * @param data 추가 데이터 객체
//  */
// export async function sendPushNotification(
//   userId: string,
//   title: string,
//   message: string,
//   data: any = {}
// ) {
//   try {
//     // 1. 푸시 구독 정보 조회
//     const subscriptions = await prisma.pushSubscription.findMany({
//       where: { userId },
//     });

//     if (subscriptions.length === 0) {
//       console.log(`사용자 ${userId}의 푸시 구독 정보가 없습니다.`);
//       return { success: false, message: '푸시 구독 정보가 없습니다.' };
//     }

//     // 2. 알림 페이로드 구성
//     const payload = JSON.stringify({
//       title,
//       message,
//       ...data,
//       timestamp: new Date().toISOString(),
//     });

//     // 3. 모든 기기에 알림 전송
//     const results = await Promise.allSettled(
//       subscriptions.map(async (subscription) => {
//         try {
//           await webpush.sendNotification(
//             {
//               endpoint: subscription.endpoint,
//               keys: {
//                 p256dh: subscription.p256dh,
//                 auth: subscription.auth,
//               },
//             },
//             payload
//           );
//           return { success: true, endpoint: subscription.endpoint };
//         } catch (error: any) {
//           // 만료된 구독인 경우 삭제
//           if (error.statusCode === 404 || error.statusCode === 410) {
//             await prisma.pushSubscription.delete({
//               where: { endpoint: subscription.endpoint },
//             });
//           }

//           return {
//             success: false,
//             endpoint: subscription.endpoint,
//             error: error.message,
//           };
//         }
//       })
//     );

//     // 4. 결과 요약
//     const successCount = results.filter(
//       (r) => r.status === 'fulfilled' && (r.value as any).success
//     ).length;

//     return {
//       success: successCount > 0,
//       message: `${successCount}/${results.length} 구독에 알림 전송 완료`,
//       results,
//     };
//   } catch (error) {
//     console.error('푸시 알림 전송 오류:', error);
//     return { success: false, error };
//   }
// }
