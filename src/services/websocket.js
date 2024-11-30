import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
        this.connected = false;
        this.pendingSubscriptions = new Map();
    }

    connect(onConnected = () => {}) {
        this.client = new Client({
            brokerURL: 'ws://localhost:9006/ws',
            connectHeaders: {
                // Authorization header nếu cần
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                this.connected = true;
                
                this.pendingSubscriptions.forEach((callback, conversationId) => {
                    this.subscribeToConversation(conversationId, callback);
                });
                this.pendingSubscriptions.clear();
                
                onConnected();
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
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
                console.log('WebSocket connection closed');
                this.connected = false;
            }
        });

        try {
            this.client.activate();
        } catch (error) {
            console.error('Error activating WebSocket connection:', error);
        }
    }

    subscribeToConversation(conversationId, callback) {
        if (!this.client || !this.client.connected) {
            this.pendingSubscriptions.set(conversationId, callback);
            return;
        }

        // Kiểm tra subscription hiện có
        if (this.subscriptions.has(conversationId)) {
            console.log(`Already subscribed to ${conversationId}`);
            return;
        }

        try {
            console.log(`Subscribing to conversation ${conversationId}`);
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
            console.log(`Successfully subscribed to ${conversationId}`);
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
                // Hủy tất cả subscriptions
                this.subscriptions.forEach((subscription) => {
                    subscription.unsubscribe();
                });
                this.subscriptions.clear();
                
                this.client.deactivate();
                this.connected = false;
            }
        } catch (error) {
            console.error('Error disconnecting WebSocket:', error);
        }
    }

    // Kiểm tra trạng thái kết nối
    isConnected() {
        return this.connected;
    }
}

export const webSocketService = new WebSocketService(); 