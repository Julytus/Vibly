import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
        this.connected = false;
        this.pendingSubscriptions = new Map();
        this.notificationHandlers = new Map();
        this.userId = null;
        this.activeUsers = new Set();
        this.isInitialized = false;
        this.setupDisconnectHandlers();
    }

    setupDisconnectHandlers() {
        // Xử lý khi user đóng tab hoặc thoát trình duyệt
        window.addEventListener('beforeunload', () => {
            this.disconnectAll();
        });
    }

    connect(onConnected = () => {}, userId = null) {
        if (userId) {
            this.userId = userId;
        }

        if (this.isConnected()) {
            onConnected();
            return;
        }

        if (this.client && !this.isConnected()) {
            return;
        }

        this.client = new Client({
            brokerURL: 'ws://localhost:9006/ws',
            connectHeaders: {
                userId: this.userId || ''
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                this.connected = true;
                this.isInitialized = true;
                
                if (this.userId) {
                    this.subscribeToNotifications(this.userId);
                }
                
                this.pendingSubscriptions.forEach((callback, topic) => {
                    if (topic.startsWith('notification/')) {
                        return;
                    }
                    this.subscribeToConversation(topic, callback);
                });
                this.pendingSubscriptions.clear();
                
                onConnected();
            },
            onDisconnect: () => {
                this.connected = false;
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
                this.connected = false;
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error', event);
                this.connected = false;
            },
            onWebSocketClose: () => {
                this.connected = false;
            }
        });

        try {
            this.client.activate();
        } catch (error) {
            console.error('[WebSocket] Error activating connection:', error);
        }
    }

    subscribeToConversation(conversationId, callback) {
        if (!this.client || !this.client.connected) {
            this.pendingSubscriptions.set(conversationId, callback);
            return;
        }

        // Kiểm tra subscription hiện có
        if (this.subscriptions.has(conversationId)) {
            return;
        }

        try {
            const subscription = this.client.subscribe(
                `/conversation/${conversationId}`,
                (message) => {
                    try {
                        const receivedMessage = JSON.parse(message.body);
                        
                        callback(receivedMessage);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                },
                { id: `sub-${conversationId}` }
            );

            this.subscriptions.set(conversationId, subscription);
        } catch (error) {
            console.error('Error subscribing to conversation:', error);
        }
    }

    unsubscribeFromConversation(conversationId) {
        try {
            const subscription = this.subscriptions.get(conversationId);
            if (subscription) {
                subscription.unsubscribe();
                this.subscriptions.delete(conversationId);
            }
        } catch (error) {
            console.error('Error unsubscribing from conversation:', error);
        }
    }

    disconnect() {
        try {
            if (this.client && this.connected) {
                if (this.userId) {
                    this.client.publish({
                        destination: '/app/user.disconnect',
                        body: JSON.stringify({ userId: this.userId })
                    });
                }
                
                this.subscriptions.forEach((subscription, topic) => {
                    if (!topic.startsWith('notification/')) {
                        subscription.unsubscribe();
                        this.subscriptions.delete(topic);
                    }
                });
                
                this.connected = false;
            }
        } catch (error) {
            console.error('[WebSocket] Error disconnecting:', error);
        }
    }

    disconnectAll() {
        try {
            if (this.client && this.connected) {
                if (this.userId) {
                    this.client.publish({
                        destination: '/app/user.disconnect',
                        body: JSON.stringify({ userId: this.userId })
                    });
                }

                this.subscriptions.forEach(subscription => {
                    try {
                        subscription.unsubscribe();
                    } catch (e) {
                        console.error('[WebSocket] Error unsubscribing:', e);
                    }
                });
                
                this.subscriptions.clear();
                this.userId = null;
                this.activeUsers.clear();
                this.client.deactivate();
                this.connected = false;
                this.isInitialized = false;
            }
        } catch (error) {
            console.error('[WebSocket] Error disconnecting all:', error);
        }
    }

    isConnected() {
        return this.connected && this.isInitialized;
    }

    subscribeToNotifications(userId, handlers) {
        this.userId = userId;

        if (!this.client || !this.client.connected) {
            this.pendingSubscriptions.set(`notification/${userId}`, handlers);
            return;
        }

        try {            
            // Kiểm tra xem đã subscribe active users chưa
            if (!this.subscriptions.has('active-users')) {
                const activeUsersSubscription = this.client.subscribe(
                    '/topic/active-users',
                    (message) => {
                        try {
                            const activeUsers = JSON.parse(message.body);
                            // Chỉ log và cập nhật nếu danh sách thực sự thay đổi
                            const currentUsers = Array.from(this.activeUsers);
                            const newUsers = Array.from(new Set(activeUsers));
                            
                            if (JSON.stringify(currentUsers) !== JSON.stringify(newUsers)) {
                                console.log('[WebSocket] Active users updated:', newUsers);
                                this.activeUsers = new Set(newUsers);
                                handlers?.onActiveUsersUpdate?.(newUsers);
                            }
                        } catch (error) {
                            console.error('[WebSocket] Error handling active users:', error);
                        }
                    }
                );
                this.subscriptions.set('active-users', activeUsersSubscription);

                // Chỉ gửi user.connect và request active users một lần
                this.client.publish({
                    destination: '/app/user.connect',
                    body: JSON.stringify({ userId: userId })
                });

                // Đợi một chút trước khi request active users để tránh race condition
                setTimeout(() => {
                    this.requestActiveUsers();
                }, 500);
            }

            // Phần code xử lý notifications khác giữ nguyên
            const subscription = this.client.subscribe(
                `/user/${userId}/notifications`,
                (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        
                        switch(notification.type) {
                            case 'MESSAGE':
                                console.log('[WebSocket] Chat notification:', notification.content);
                                handlers?.onNewMessage?.(notification);
                                this.notificationHandlers.get('MESSAGE')?.(notification);
                                break;
                            case 'POST':
                                console.log('[WebSocket] Post notification:', notification);
                                handlers?.onNewPost?.(notification);
                                this.notificationHandlers.get('POST')?.(notification);
                                break;
                            case 'COMMENT':
                                console.log('[WebSocket] COMMENT notification:', notification);
                                handlers?.onNewPost?.(notification);
                                this.notificationHandlers.get('COMMENT')?.(notification);
                                break;
                            case 'REACTION':
                                console.log('[WebSocket] REACTION notification:', notification);
                                handlers?.onNewPost?.(notification);
                                this.notificationHandlers.get('REACTION')?.(notification);
                                break;
                            case 'FRIEND_REQUEST':
                                console.log('[WebSocket] Friend request notification:', notification);
                                handlers?.onFriendRequest?.(notification);
                                this.notificationHandlers.get('FRIEND_REQUEST')?.(notification);
                                break;
                            case 'REQUEST_ACCEPTED':
                                console.log('[WebSocket] Friend request accepted notification:', notification);
                                handlers?.onFriendRequestAccepted?.(notification);
                                this.notificationHandlers.get('REQUEST_ACCEPTED')?.(notification);
                                break;
                            default:
                                console.log('[WebSocket] Unknown notification type:', notification.type);
                        }
                    } catch (error) {
                        console.error('[WebSocket] Error handling notification:', error);
                    }
                },
                { id: `notification-${userId}` }
            );

            this.subscriptions.set(`notification/${userId}`, subscription);
            console.log(`[WebSocket] Successfully subscribed to /user/${userId}/notifications`);
        } catch (error) {
            console.error('[WebSocket] Error subscribing to notifications:', error);
        }
    }

    unsubscribeFromNotifications(userId) {
        const subscriptionKey = `notification/${userId}`;
        const subscription = this.subscriptions.get(subscriptionKey);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
        }
    }

    getActiveUsers() {
        return Array.from(this.activeUsers);
    }

    isUserActive(userId) {
        return this.activeUsers.has(userId);
    }

    requestActiveUsers() {
        if (this.client && this.connected) {
            try {
                this.client.publish({
                    destination: '/app/active-users',
                    body: JSON.stringify({})
                });
            } catch (error) {
                console.error('[WebSocket] Error requesting active users:', error);
            }
        }
    }
}

export const webSocketService = new WebSocketService(); 