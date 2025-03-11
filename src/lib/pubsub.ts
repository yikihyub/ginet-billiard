type Callback = (...args: any[]) => void;

class PubSub {
  private subscribers: Map<string, Set<Callback>>;

  constructor() {
    this.subscribers = new Map();
  }

  subscribe(event: string, callback: Callback): () => void {
    // 이벤트에 대한 구독자 집합이 없으면 새로 만듭니다
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }

    // 콜백을 구독자 집합에 추가합니다
    this.subscribers.get(event)!.add(callback);

    // 구독 취소 함수를 반환합니다
    return () => {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(event);
        }
      }
    };
  }

  publish(event: string, ...args: any[]): void {
    // 이벤트에 대한 구독자가 없으면 아무것도 하지 않습니다
    if (!this.subscribers.has(event)) {
      return;
    }

    // 모든 구독자에게 이벤트를 발행합니다
    for (const callback of this.subscribers.get(event)!) {
      callback(...args);
    }
  }
}

// 싱글톤 인스턴스를 내보냅니다
export const pubsub = new PubSub();
