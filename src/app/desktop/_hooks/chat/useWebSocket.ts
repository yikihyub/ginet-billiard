// 'use client';

// import { useEffect, useState, useRef, useCallback } from 'react';

// // 채팅 메시지 타입 정의
// type ChatMessage = {
//   type: 'message' | 'join' | 'leave' | 'read';
//   senderId: string;
//   username?: string;
//   content?: string;
//   roomId?: string;
//   messageId?: string;
//   timestamp?: number;
// };

// // 웹소켓 훅 파라미터 타입
// interface UseWebSocketProps {
//   userId?: string;
//   username?: string;
// }

// // 웹소켓 훅 반환 타입
// interface UseWebSocketReturn {
//   isConnected: boolean;
//   sendMessage: (content: string, roomId: string) => void;
//   joinRoom: (roomId: string) => void;
//   markAsRead: (messageId: string, roomId: string) => void;
//   messages: ChatMessage[];
//   connectionError: string | null;
// }

// export function useWebSocket({
//   userId,
//   username,
// }: UseWebSocketProps): UseWebSocketReturn {
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [connectionError, setConnectionError] = useState<string | null>(null);
//   const wsRef = useRef<WebSocket | null>(null);
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const messageQueueRef = useRef<ChatMessage[]>([]);
//   const roomsRef = useRef<Set<string>>(new Set());

//   // WebSocket 서버 초기화 함수
//   const initializeWebSocket = useCallback(async () => {
//     if (!userId || !username) {
//       setConnectionError('사용자 ID와 이름이 필요합니다');
//       return;
//     }

//     try {
//       // 이미 연결된 웹소켓이 있다면 재사용
//       if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//         setIsConnected(true);
//         return;
//       }

//       // 연결이 진행중인 웹소켓이 있다면 기다림
//       if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
//         return;
//       }

//       // 기존 웹소켓이 있다면 정리
//       if (wsRef.current) {
//         wsRef.current.close();
//         wsRef.current = null;
//       }

//       // 웹소켓 서버 초기화 API 호출
//       try {
//         const response = await fetch('/api/websocket/init');
//         if (!response.ok) {
//           console.warn('WebSocket 서버 초기화 응답:', response.status);
//         } else {
//           // console.log('WebSocket 서버 초기화 완료');
//         }
//       } catch (error) {
//         console.warn('WebSocket 서버 초기화 API 호출 오류:', error);
//       }

//       // WebSocket URL 설정
//       const websocketUrl =
//         process.env.NODE_ENV === 'production'
//           ? `wss://${window.location.host}`
//           : 'ws://localhost:3001';

//       // console.log(`WebSocket 연결 시도: ${websocketUrl}`);

//       // WebSocket 인스턴스 생성
//       const ws = new WebSocket(websocketUrl);
//       wsRef.current = ws;

//       // 연결 이벤트 처리
//       ws.onopen = () => {
//         // console.log('✅ WebSocket connected');
//         setIsConnected(true);
//         setConnectionError(null);

//         // 연결이 끊어졌다가 재연결된 경우, 이전 채팅방 재참여
//         roomsRef.current.forEach((roomId) => {
//           joinRoomInternal(roomId);
//         });

//         // 연결 후 대기중인 메시지 전송
//         if (messageQueueRef.current.length > 0) {
//           messageQueueRef.current.forEach((msg) => {
//             if (ws.readyState === WebSocket.OPEN) {
//               ws.send(JSON.stringify(msg));
//             }
//           });
//           messageQueueRef.current = [];
//         }
//       };

//       // 메시지 수신 이벤트 처리
//       ws.onmessage = (event) => {
//         try {
//           const receivedMessage: ChatMessage = JSON.parse(event.data);
//           // console.log('📩 Received:', receivedMessage);

//           // 메시지 처리 로직
//           if (receivedMessage.type === 'message') {
//             setMessages((prev) => [...prev, receivedMessage]);
//           } else if (
//             receivedMessage.type === 'join' ||
//             receivedMessage.type === 'leave'
//           ) {
//             // 시스템 메시지로 처리
//             const systemMessage: ChatMessage = {
//               ...receivedMessage,
//               content:
//                 receivedMessage.type === 'join'
//                   ? `${receivedMessage.username}님이 입장했습니다.`
//                   : `${receivedMessage.username}님이 퇴장했습니다.`,
//             };
//             setMessages((prev) => [...prev, systemMessage]);
//           }
//           // 'read' 타입은 UI에서 읽음 표시를 업데이트하는 데 사용
//         } catch (error) {
//           console.error('메시지 파싱 오류:', error);
//         }
//       };

//       // 연결 종료 이벤트 처리
//       ws.onclose = (event) => {
//         // console.log('❌ WebSocket disconnected', event.code, event.reason);
//         setIsConnected(false);

//         // 비정상 종료인 경우에만 재연결 시도
//         if (event.code !== 1000 && event.code !== 1001) {
//           // 지수 백오프로 재연결
//           if (reconnectTimeoutRef.current) {
//             clearTimeout(reconnectTimeoutRef.current);
//           }

//           const reconnectDelay = Math.min(30000, (Math.random() + 1) * 2000);
//           console.log(`🔄 Reconnecting in ${reconnectDelay}ms...`);

//           reconnectTimeoutRef.current = setTimeout(() => {
//             initializeWebSocket();
//           }, reconnectDelay);
//         }
//       };

//       // 에러 이벤트 처리
//       ws.onerror = (error) => {
//         console.error('⚠️ WebSocket error:', error);
//         setConnectionError('연결 중 오류가 발생했습니다');
//       };
//     } catch (error) {
//       console.error('⚠️ WebSocket initialization error:', error);
//       setConnectionError('WebSocket 초기화 중 오류가 발생했습니다');
//     }
//   }, [userId, username]);

//   // 내부적으로 사용하는 채팅방 참여 함수
//   const joinRoomInternal = useCallback(
//     (roomId: string) => {
//       if (!userId || !username) return;

//       const joinMessage: ChatMessage = {
//         type: 'join',
//         senderId: userId,
//         username: username,
//         roomId: roomId,
//         timestamp: Date.now(),
//       };

//       if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//         wsRef.current.send(JSON.stringify(joinMessage));
//         roomsRef.current.add(roomId);
//       } else {
//         messageQueueRef.current.push(joinMessage);
//       }
//     },
//     [userId, username]
//   );

//   // 웹소켓 초기화 및 정리
//   useEffect(() => {
//     if (!userId || !username) return;

//     // console.log('WebSocket 훅 초기화:', { userId, username });
//     initializeWebSocket();

//     // 정리 함수
//     return () => {
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }

//       if (wsRef.current) {
//         // console.log('🔌 Cleaning up WebSocket connection');
//         wsRef.current.close(1000, 'Normal closure');
//         wsRef.current = null;
//         setIsConnected(false);
//       }
//     };
//   }, [userId, username, initializeWebSocket]);

//   // 채팅방 참여 함수
//   const joinRoom = useCallback(
//     (roomId: string) => {
//       // console.log('🚪 Joining room:', roomId);
//       joinRoomInternal(roomId);
//     },
//     [joinRoomInternal]
//   );

//   // 메시지 전송 함수
//   const sendMessage = useCallback(
//     (content: string, roomId: string) => {
//       if (!userId || !content.trim() || !roomId) return;

//       // console.log('📤 Sending message to room:', roomId);

//       const message: ChatMessage = {
//         type: 'message',
//         senderId: userId,
//         content: content.trim(),
//         roomId: roomId,
//         timestamp: Date.now(),
//       };

//       if (wsRef.current && isConnected) {
//         wsRef.current.send(JSON.stringify(message));
//         // 내가 보낸 메시지도 로컬 상태에 추가 (즉각적인 UI 업데이트)
//         setMessages((prev) => [...prev, message]);
//       } else {
//         console.warn('🚨 Cannot send message: WebSocket not connected');
//         // 메시지 큐에 추가
//         messageQueueRef.current.push(message);
//         // 연결이 끊겼다면 재연결 시도
//         if (!isConnected) {
//           initializeWebSocket();
//         }
//       }
//     },
//     [userId, isConnected, initializeWebSocket]
//   );

//   // 읽음 표시 함수
//   const markAsRead = useCallback(
//     (messageId: string, roomId: string) => {
//       if (!userId || !messageId || !roomId) return;

//       // console.log('👁️ Marking message as read:', messageId);

//       const readMessage: ChatMessage = {
//         type: 'read',
//         senderId: userId,
//         messageId: messageId,
//         roomId: roomId,
//         timestamp: Date.now(),
//       };

//       if (wsRef.current && isConnected) {
//         wsRef.current.send(JSON.stringify(readMessage));
//       } else {
//         console.warn('🚨 Cannot mark as read: WebSocket not connected');
//         messageQueueRef.current.push(readMessage);
//         if (!isConnected) {
//           initializeWebSocket();
//         }
//       }
//     },
//     [userId, isConnected, initializeWebSocket]
//   );

//   return {
//     isConnected,
//     sendMessage,
//     joinRoom,
//     markAsRead,
//     messages,
//     connectionError,
//   };
// }
