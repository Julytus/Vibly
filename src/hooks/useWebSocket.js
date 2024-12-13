import { useEffect, useCallback, useState } from 'react';
import { webSocketService } from '../services/websocket';

export const useWebSocket = (userProfile) => {
    const [activeUsers, setActiveUsers] = useState([]);

    const handleNotification = useCallback((notification) => {        
        const handler = webSocketService.notificationHandlers.get(notification.type);
        if (handler) {
            handler(notification);
        }

        if (notification.type === 'MESSAGE' && window.chatSidebarHandler) {
            window.chatSidebarHandler(notification);
        }
    }, []);

    const handleActiveUsersUpdate = useCallback((users) => {
        setActiveUsers(users);
    }, []);

    useEffect(() => {
        if (userProfile?.id && !webSocketService.isConnected()) {
            webSocketService.connect(() => {
                webSocketService.subscribeToNotifications(userProfile.id, {
                    onNewMessage: handleNotification,
                    onFriendRequest: handleNotification,
                    onFriendRequestAccepted: handleNotification,
                    onActiveUsersUpdate: handleActiveUsersUpdate
                });
            }, userProfile.id);

            return () => {
                console.log('[WebSocket] Cleaning up connection');
                webSocketService.unsubscribeFromNotifications(userProfile.id);
                webSocketService.disconnectAll();
            };
        }
    }, [userProfile?.id, handleNotification, handleActiveUsersUpdate]);

    return {
        webSocketService,
        activeUsers
    };
}; 