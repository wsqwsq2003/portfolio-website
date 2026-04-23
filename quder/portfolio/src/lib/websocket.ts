import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { Client } from '@stomp/stompjs';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

type ContentUpdateCallback = (locale: string, content: any) => void;

let stompClient: Client | null = null;
const callbacks: Map<string, ContentUpdateCallback> = new Map();

/**
 * Initialize WebSocket connection
 */
export function initWebSocket() {
  if (stompClient) return;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('WebSocket connected');
      
      // Subscribe to all registered callbacks
      callbacks.forEach((_, locale) => {
        subscribeToLocale(locale);
      });
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
  });

  stompClient.activate();
}

/**
 * Subscribe to content updates for a specific locale
 */
function subscribeToLocale(locale: string) {
  if (!stompClient || !stompClient.connected) return;

  stompClient.subscribe(`/topic/content/${locale}`, (message) => {
    try {
      const content = JSON.parse(message.body);
      const callback = callbacks.get(locale);
      if (callback) {
        callback(locale, JSON.parse(content.content));
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  });
}

/**
 * Register callback for content updates
 */
export function onContentUpdate(locale: string, callback: ContentUpdateCallback) {
  callbacks.set(locale, callback);
  
  if (stompClient && stompClient.connected) {
    subscribeToLocale(locale);
  }
}

/**
 * Remove callback
 */
export function offContentUpdate(locale: string) {
  callbacks.delete(locale);
}

/**
 * Disconnect WebSocket
 */
export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
  callbacks.clear();
}
