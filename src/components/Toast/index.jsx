import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useWebSocket } from '../../hooks/useWebSocket';
import { getAvatarById } from '../../services/api';
import './styles.css';

const Toast = () => {
  const [notifications, setNotifications] = useState([]);
  const { userProfile } = useSelector((state) => state.account);
  const { webSocketService } = useWebSocket(userProfile);
  const processedNotifications = useRef(new Set());

  const addNotification = useCallback(async (notification) => {
    if (notification.type === 'MESSAGE') return;

    try {
      const combinedId = userProfile.id + notification.id;

      if (processedNotifications.current.has(combinedId)) {
        return;
      }
      
      processedNotifications.current.add(combinedId);

      const hideTimeoutId = setTimeout(() => {
        setNotifications(prev => 
          prev.map(n => n.id === combinedId ? {...n, show: false} : n)
        );
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== combinedId));
          processedNotifications.current.delete(combinedId);
        }, 300);
      }, 5000);

      const avatarUrl = await getAvatarById(notification.sender_id);

      setNotifications(prev => [{
        id: combinedId,
        ...notification,
        originalId: notification.id,
        avatar: avatarUrl,
        show: true,
        timeoutId: hideTimeoutId
      }, ...prev].slice(0, 5));
    } catch (error) {
      console.error('Error handling notification:', error);
      processedNotifications.current.delete(notification.id);
    }
  }, []);

  const handleClose = useCallback((notificationId, e) => {
    e.stopPropagation();
    
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? {...n, show: false} : n)
    );
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      processedNotifications.current.delete(notificationId);
    }, 300);
  }, []);

  const handleNotificationClick = useCallback((notification, e) => {
    if (e.target.closest('.notification-close')) {
      return;
    }
    window.location.href = `/profile/${notification.sender_id}`;
  }, []);

  useEffect(() => {
    if (userProfile?.id && webSocketService) {
      webSocketService.notificationHandlers.set('FRIEND_REQUEST', addNotification);
      webSocketService.notificationHandlers.set('REQUEST_ACCEPTED', addNotification);

      return () => {
        webSocketService.notificationHandlers.delete('FRIEND_REQUEST');
        webSocketService.notificationHandlers.delete('REQUEST_ACCEPTED');
        notifications.forEach(n => {
          if (n.timeoutId) clearTimeout(n.timeoutId);
        });
        processedNotifications.current.clear();
      };
    }
  }, [userProfile?.id, webSocketService, addNotification]);

  const renderNotificationContent = useCallback((notification) => {
    switch (notification.type) {
      case 'FRIEND_REQUEST':
        return (
          <>
            <img 
              src={notification.avatar}
              alt={notification.sender_name}
              className="notification-avatar"
            />
            <div className="notification-content">
              <p className="notification-title">New Friend Request</p>
              <p className="notification-message">
                {notification.sender_name} sent you a friend request
              </p>
            </div>
            <button 
              className="notification-close material-symbols-outlined"
              onClick={(e) => handleClose(notification.id, e)}
              type="button"
            >
              close
            </button>
          </>
        );
      case 'REQUEST_ACCEPTED':
        return (
          <>
            <img 
              src={notification.avatar}
              alt={notification.sender_name}
              className="notification-avatar"
            />
            <div className="notification-content">
              <p className="notification-title">Friend Request Accepted</p>
              <p className="notification-message">
                {notification.sender_name} accepted your friend request
              </p>
            </div>
            <button 
              className="notification-close material-symbols-outlined"
              onClick={(e) => handleClose(notification.id, e)}
              type="button"
            >
              close
            </button>
          </>
        );
      default:
        return null;
    }
  }, [handleClose]);

  return (
    <div className="toast-container">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`toast-notification ${notification.show ? 'show' : ''}`}
          onClick={(e) => handleNotificationClick(notification, e)}
          role="button"
          tabIndex={0}
        >
          {renderNotificationContent(notification)}
        </div>
      ))}
    </div>
  );
};

export default Toast; 