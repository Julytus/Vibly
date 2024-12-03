import { useEffect, useCallback, useState } from 'react';
import { webSocketService } from '../services/websocket';

export const useWebSocket = (userProfile) => {
    const [activeUsers, setActiveUsers] = useState([]);

    const handleNotification = useCallback((notification) => {
        switch(notification.type) {
            case 'MESSAGE':
                if (window.chatSidebarHandler) {
                    window.chatSidebarHandler(notification);
                }
                break;
        }
    }, []);

    const handleActiveUsersUpdate = useCallback((users) => {
        setActiveUsers(users);
    }, []);

    useEffect(() => {
        if (userProfile?.id && !webSocketService.isConnected()) {
            console.log('[WebSocket] Connecting for user:', userProfile.id);
            webSocketService.connect(() => {
                webSocketService.subscribeToNotifications(userProfile.id, {
                    onNewMessage: handleNotification,
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