import React, { useState, useEffect, useRef } from 'react';
import { getFriendRequests, acceptFriendRequest, declineFriendRequest } from '../../services/api';
import { useSelector } from 'react-redux';

const FriendRequests = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef(null);
  const { userProfile } = useSelector((state) => state.account);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await getFriendRequests(page);
        console.log("getFriendRequest", response);
        
        setNotifications(prev => 
          page === 1 ? response.data : [...prev, ...response.data]
        );
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (showDropdown) {
      fetchRequests();
    }
  }, [showDropdown, page, userProfile.id]);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      setNotifications(notifications.filter(notif => notif.id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await declineFriendRequest(requestId);
      setNotifications(notifications.filter(notif => notif.id !== requestId));
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const renderNotificationContent = (notification) => {
    if (notification.type === 'FRIEND_REQUEST') {
      return (
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <img 
              className="avatar-40 rounded-pill" 
              src={notification.img} 
              alt={notification.sender_name} 
              loading="lazy" 
            />
            <div className="ms-3">
              <h6 className="mb-0">{notification.sender_name}</h6>
              <p className="mb-0">Sent you a friend request</p>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <a 
              className="me-2 rounded bg-primary-subtle border-0 d-inline-block px-1"
              onClick={() => handleAccept(notification.reference_id)}
            >
              <span className="material-symbols-outlined font-size-18 align-text-bottom">
                add
              </span>
            </a>
            <a 
              className="me-3 rounded bg-danger-subtle border-0 d-inline-block px-1"
              onClick={() => handleDecline(notification.reference_id)}
            >
              <span className="material-symbols-outlined font-size-18 align-text-bottom">
                close
              </span>
            </a>
          </div>
        </div>
      );
    } else if (notification.type === 'REQUEST_ACCEPTED') {
      return (
        <div className="d-flex align-items-center mb-4">
          <img 
            className="avatar-40 rounded-pill" 
            src={notification.img}
            alt={notification.sender_name} 
            loading="lazy" 
          />
          <div className="ms-3">
            <h6 className="mb-0">{notification.sender_name}</h6>
            <p className="mb-0">Accepted your friend request</p>
          </div>
        </div>
      );
    }
  };

  return (
    <li className="nav-item dropdown" ref={dropdownRef}>
      <a
        href="#"
        className="dropdown-toggle d-flex align-items-center"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="material-symbols-outlined position-relative">
          group
          {notifications.length > 0 && (
            <span className="bg-primary text-white notification-badge"></span>
          )}
        </span>
      </a>
      
      {showDropdown && (
        <div className="sub-drop sub-drop-large dropdown-menu show">
          <div className="card shadow m-0">
            <div className="card-header d-flex justify-content-between px-0 pb-4 mx-5 border-bottom">
              <div className="header-title">
                <h5 className="fw-semibold">Friend Notifications</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="item-header-scroll">
                {notifications.map((notification) => (
                  <div className="iq-friend-request" key={notification.id}>
                    {renderNotificationContent(notification)}
                  </div>
                ))}
              </div>
              
              {notifications.length > 0 && (
                <div className="text-center">
                  <button 
                    type="button" 
                    className="btn btn-primary fw-500 mt-4"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'View More'}
                  </button>
                </div>
              )}

              {notifications.length === 0 && (
                <div className="text-center py-4">
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default FriendRequests;
