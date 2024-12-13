import React, { useEffect, useState, useRef } from 'react';
import { 
    sendFriendRequest, 
    checkFriendRequest, 
    cancelFriendRequest, 
    acceptFriendRequest,
    declineFriendRequest,
    checkFriendStatus,
    unfriend
} from '../../services/api';

const FriendRequestButton = ({ profileId, currentUserId }) => {
    const [friendRequestStatus, setFriendRequestStatus] = useState({
        exists: false,
        requestId: null,
        isSender: false,
        status: null,
        isFriend: false
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const checkStatus = async () => {
            if (profileId && profileId !== currentUserId) {
                try {
                    // Kiểm tra trạng thái bạn bè
                    const isFriend = await checkFriendStatus(profileId, currentUserId);
                    
                    if (isFriend) {
                        setFriendRequestStatus({
                            exists: false,
                            requestId: null,
                            isSender: false,
                            status: null,
                            isFriend: true
                        });
                        return;
                    }

                    // Nếu không phải bạn bè, kiểm tra friend request
                    const request = await checkFriendRequest(profileId);
                    if (request) {
                        setFriendRequestStatus({
                            exists: true,
                            requestId: request.id,
                            isSender: request.sender.id === currentUserId,
                            status: request.status,
                            isFriend: false
                        });
                    }
                } catch (error) {
                    console.error("Error checking status:", error);
                }
            }
        };
        
        checkStatus();
    }, [profileId, currentUserId]);

    // Xử lý click outside để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFriendRequest = async (action) => {
        try {
            const { exists, requestId, isSender, isFriend } = friendRequestStatus;

            if (isFriend && action === 'unfriend') {
                await unfriend(profileId);
                setFriendRequestStatus({
                    exists: false,
                    requestId: null,
                    isSender: false,
                    status: null,
                    isFriend: false
                });
                setShowDropdown(false);
                return;
            }

            if (exists) {
                if (isSender) {
                    await cancelFriendRequest(requestId);
                } else {
                    if (action === 'accept') {
                        await acceptFriendRequest(requestId);
                    } else if (action === 'decline') {
                        await declineFriendRequest(requestId);
                    }
                }
                setFriendRequestStatus({
                    exists: false,
                    requestId: null,
                    isSender: false,
                    status: null,
                    isFriend: action === 'accept'
                });
            } else {
                const response = await sendFriendRequest(profileId);
                setFriendRequestStatus({
                    exists: true,
                    requestId: response.id,
                    isSender: true,
                    status: 'PENDING',
                    isFriend: false
                });
            }
        } catch (error) {
            console.error("Error handling friend request:", error);
        }
    };

    const getFriendButtonConfig = () => {
        const { exists, isSender, isFriend } = friendRequestStatus;
        
        if (isFriend) {
            return [{
                text: 'Friends',
                icon: 'people',
                className: 'btn-success dropdown-toggle',
                action: 'showDropdown'
            }];
        }

        if (!exists) {
            return [{
                text: 'Add friend',
                icon: 'add',
                className: 'btn-primary',
                action: 'add'
            }];
        }

        if (isSender) {
            return [{
                text: 'Cancel Request',
                icon: 'close',
                className: 'btn-secondary',
                action: 'cancel'
            }];
        }

        return [
            {
                text: 'Accept',
                icon: 'check',
                className: 'btn-success',
                action: 'accept'
            },
            {
                text: 'Decline',
                icon: 'close',
                className: 'btn-danger',
                action: 'decline'
            }
        ];
    };

    const buttonConfigs = getFriendButtonConfig();

    return (
        <div className="d-flex gap-2 position-relative" ref={dropdownRef}>
            {buttonConfigs.map((config, index) => (
                <button 
                    key={index}
                    type="button" 
                    className={`btn ${config.className} btn-sm d-flex align-items-center`}
                    onClick={() => {
                        if (config.action === 'showDropdown') {
                            setShowDropdown(!showDropdown);
                        } else {
                            handleFriendRequest(config.action);
                        }
                    }}
                >
                    <span className="material-symbols-outlined md-16 me-1">
                        {config.icon}
                    </span>
                    {config.text}
                </button>
            ))}
            
            {/* Dropdown menu for Friends button */}
            {showDropdown && friendRequestStatus.isFriend && (
                <div className="dropdown-menu show position-absolute top-100 mt-1">
                    <button 
                        className="dropdown-item text-danger d-flex align-items-center"
                        onClick={() => handleFriendRequest('unfriend')}
                    >
                        <span className="material-symbols-outlined md-16 me-2">
                            person_remove
                        </span>
                        Unfriend
                    </button>
                </div>
            )}
        </div>
    );
};

export default FriendRequestButton; 