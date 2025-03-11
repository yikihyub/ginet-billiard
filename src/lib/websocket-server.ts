import { WebSocketServer, WebSocket } from 'ws';
import { createServer, Server as HTTPServer } from 'http';
import { ChatMessage, saveMessage, markMessageAsRead } from './chat-service';

// WebSocket 서버 및 HTTP 서버 인스턴스
let wss: WebSocketServer | undefined;
let httpServer: HTTPServer | undefined;

// 클라이언트 정보 인터페이스
interface ClientInfo {
  ws: WebSocket;
  userId: string | null;
  username: string | null;
  rooms: Set<string>;
}

// 연결된 클라이언트를 관리하기 위한 Map
const clients: Map<string, ClientInfo> = new Map();

// WebSocket 서버 상태 확인
export function getWebSocketServer(): WebSocketServer | undefined {
  return wss;
}

// WebSocket 서버 초기화
export async function initWebSocketServer(): Promise<WebSocketServer> {
  if (wss) {
    return wss;
  }

  // HTTP 서버 생성
  if (!httpServer) {
    httpServer = createServer();

    // HTTP 서버 시작
    await new Promise<void>((resolve) => {
      if (!httpServer) return resolve();

      if (!httpServer.listening) {
        httpServer.listen(3001, () => {
          console.log('WebSocket HTTP 서버가 포트 3001에서 실행 중입니다');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // WebSocket 서버 생성
  wss = new WebSocketServer({ server: httpServer });

  // 연결 이벤트 처리
  wss.on('connection', handleConnection);

  // 서버 에러 처리
  wss.on('error', (error) => {
    console.error('WebSocket 서버 오류:', error);
  });

  return wss;
}

// 연결 핸들러
function handleConnection(ws: WebSocket) {
  // 각 연결에 고유 ID 할당
  const clientId = Date.now().toString();
  clients.set(clientId, {
    ws,
    userId: null,
    username: null,
    rooms: new Set(),
  });

  // 메시지 수신 처리
  ws.on('message', (messageData) => handleMessage(clientId, ws, messageData));

  // 연결 종료 처리
  ws.on('close', () => handleClose(clientId));

  // 에러 처리
  ws.on('error', (error) => {
    console.error(`클라이언트 ${clientId} 에러:`, error);
  });

  // 핑-퐁 메커니즘 구현 (연결 유지)
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(pingInterval);
    }
  }, 30000);
}

// 메시지 핸들러
async function handleMessage(
  clientId: string,
  ws: WebSocket,
  messageData: any
) {
  try {
    // Buffer 또는 string 타입 처리
    const messageStr =
      messageData instanceof Buffer
        ? messageData.toString()
        : messageData.toString();

    const parsedMessage: ChatMessage = JSON.parse(messageStr);

    // 메시지 타입에 따른 처리
    switch (parsedMessage.type) {
      case 'join':
        await handleJoinMessage(clientId, parsedMessage);
        break;

      case 'message':
        await handleChatMessage(parsedMessage, ws);
        break;

      case 'read':
        await handleReadMessage(clientId, parsedMessage);
        break;
    }
  } catch (error) {
    console.error('메시지 처리 오류:', error);

    // JSON 파싱 오류 등의 경우 클라이언트에 오류 전송
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: '메시지 처리 중 오류가 발생했습니다',
          timestamp: Date.now(),
        })
      );
    }
  }
}

// 채팅방 참여 메시지 처리
async function handleJoinMessage(clientId: string, parsedMessage: ChatMessage) {
  const clientInfo = clients.get(clientId);
  if (!clientInfo) return;

  // 사용자 정보 업데이트
  clientInfo.userId = parsedMessage.senderId;
  clientInfo.username = parsedMessage.username || null;

  // 채팅방 참여 처리
  if (parsedMessage.roomId) {
    clientInfo.rooms.add(parsedMessage.roomId);

    // 다른 참여자들에게 입장 알림
    broadcastToRoom(
      parsedMessage.roomId,
      {
        type: 'join',
        senderId: parsedMessage.senderId,
        username: parsedMessage.username,
        roomId: parsedMessage.roomId,
        timestamp: Date.now(),
      },
      clientId
    );
  }
}

// 채팅 메시지 처리
async function handleChatMessage(parsedMessage: ChatMessage, ws: WebSocket) {
  if (!parsedMessage.roomId) return;

  try {
    // 타임스탬프 추가
    const messageWithTimestamp = {
      ...parsedMessage,
      timestamp: parsedMessage.timestamp || Date.now(),
    };

    // 메시지를 데이터베이스에 저장
    const messageId = await saveMessage(messageWithTimestamp);

    // 생성된 ID를 메시지에 추가
    const completeMessage = {
      ...messageWithTimestamp,
      id: messageId,
    };

    // 채팅방의 모든 참여자에게 메시지 전송
    broadcastToRoom(parsedMessage.roomId, completeMessage);
  } catch (error) {
    console.error('메시지 저장 오류:', error);

    // 오류 발생 시 송신자에게 오류 메시지 전송
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: '메시지 저장 중 오류가 발생했습니다',
          originalMessage: parsedMessage,
          timestamp: Date.now(),
        })
      );
    }
  }
}

// 읽음 표시 메시지 처리
async function handleReadMessage(clientId: string, parsedMessage: ChatMessage) {
  if (!parsedMessage.roomId || !parsedMessage.messageId) return;

  try {
    // 데이터베이스에 읽음 표시 저장 (필요한 경우)
    if (parsedMessage.senderId && parsedMessage.messageId) {
      await markMessageAsRead(
        parsedMessage.messageId,
        parsedMessage.senderId,
        parsedMessage.roomId
      );
    }

    // 읽음 표시를 다른 클라이언트에게 브로드캐스트
    broadcastToRoom(
      parsedMessage.roomId,
      {
        type: 'read',
        senderId: parsedMessage.senderId,
        messageId: parsedMessage.messageId,
        roomId: parsedMessage.roomId,
        timestamp: Date.now(),
      },
      clientId
    );
  } catch (error) {
    console.error('읽음 표시 처리 오류:', error);
  }
}

// 연결 종료 처리
function handleClose(clientId: string) {
  const clientInfo = clients.get(clientId);

  // 참여 중이던 모든 채팅방에 퇴장 알림
  if (clientInfo && clientInfo.userId) {
    clientInfo.rooms.forEach((roomId) => {
      broadcastToRoom(
        roomId,
        {
          type: 'leave',
          senderId: clientInfo.userId as string,
          username: clientInfo.username || undefined,
          roomId,
          timestamp: Date.now(),
        },
        clientId
      );
    });
  }

  // 클라이언트 목록에서 제거
  clients.delete(clientId);
  console.log(`클라이언트 연결 종료: ${clientId}`);
}

// 특정 채팅방의 모든 참여자에게 메시지 전송 함수
export function broadcastToRoom(
  roomId: string,
  message: ChatMessage,
  excludeClientId?: string
) {
  clients.forEach((clientInfo, clientId) => {
    // 특정 클라이언트 제외 옵션 확인
    if (excludeClientId && clientId === excludeClientId) {
      return;
    }

    // 해당 채팅방에 참여 중인 클라이언트인지 확인
    if (
      clientInfo.rooms.has(roomId) &&
      clientInfo.ws.readyState === WebSocket.OPEN
    ) {
      clientInfo.ws.send(JSON.stringify(message));
    }
  });
}

// 모든 클라이언트에게 메시지 전송 함수 (필요한 경우)
export function broadcastToAll(message: ChatMessage, excludeClientId?: string) {
  clients.forEach((clientInfo, clientId) => {
    if (excludeClientId && clientId === excludeClientId) {
      return;
    }

    if (clientInfo.ws.readyState === WebSocket.OPEN) {
      clientInfo.ws.send(JSON.stringify(message));
    }
  });
}

// 서버 종료 함수 (필요한 경우)
export function closeWebSocketServer() {
  if (wss) {
    wss.close(() => {
      console.log('WebSocket 서버가 종료되었습니다');
    });
    wss = undefined;
  }

  if (httpServer) {
    httpServer.close(() => {
      console.log('HTTP 서버가 종료되었습니다');
    });
    httpServer = undefined;
  }

  clients.clear();
}
