import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscribers = new Map();
  }

  connect(onConnectCallback) {
    if (this.client && this.client.active) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        console.log('[ResQNet WebSocket] Connected successfully');
        if (onConnectCallback) onConnectCallback();

        // Resubscribe active subscriptions upon reconnect
        this.subscribers.forEach((callbacks, topic) => {
          this._subscribeToTopic(topic, callbacks);
        });
      },
      onDisconnect: () => {
        this.connected = false;
        console.log('[ResQNet WebSocket] Disconnected');
      },
      onStompError: (frame) => {
        console.error('[ResQNet WebSocket] Broker error:', frame.headers['message']);
      },
    });

    this.client.activate();
  }

  subscribe(topic, callback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic).add(callback);

    if (this.connected) {
      return this._subscribeToTopic(topic, this.subscribers.get(topic));
    }

    return () => {
      this.unsubscribe(topic, callback);
    };
  }

  _subscribeToTopic(topic, callbacks) {
    if (!this.client || !this.connected) return () => {};

    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callbacks.forEach((cb) => cb(data));
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }

  unsubscribe(topic, callback) {
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic).delete(callback);
      if (this.subscribers.get(topic).size === 0) {
        this.subscribers.delete(topic);
      }
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }
}

export const wsService = new WebSocketService();
