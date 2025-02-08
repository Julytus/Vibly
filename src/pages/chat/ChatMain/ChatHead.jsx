import { useEffect, useState } from 'react';
import { webSocketService } from '../../../services/websocket';
import { Link } from 'react-router-dom';

const ChatHead = ({ otherUser, otherAvatar }) => {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (!otherUser) return;

        // Kiểm tra trạng thái online ban đầu
        setIsOnline(webSocketService.isUserActive(otherUser.id));

        // Theo dõi thay đổi trạng thái online
        const checkOnlineStatus = () => {
            setIsOnline(webSocketService.isUserActive(otherUser.id));
        };

        // Đăng ký interval để kiểm tra trạng thái
        const intervalId = setInterval(checkOnlineStatus, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [otherUser?.id]);

    if (!otherUser) return null;

    return (
        <div className="chat-head">
            <header className="d-flex justify-content-between align-items-center pt-3 ps-3 pe-3 pb-3">
                <div className="d-flex align-items-center gap-3">
                    <Link to={`/profile/${otherUser.id}`} className="avatar chat-user-profile m-0">
                        <img src={otherAvatar} alt="avatar" className="avatar-50 rounded-pill" loading="lazy" />
                        {isOnline && <div className="iq-profile-badge bg-success"></div>}
                    </Link>
                    <div>
                        <Link 
                            to={`/profile/${otherUser.id}`} 
                            className="text-decoration-none"
                        >
                            <h5 className="mb-0 text-dark">{otherUser.first_name} {otherUser.last_name}</h5>
                        </Link>
                        <small className="text-capitalize fw-500">
                            {isOnline ? 'Online' : 'Offline'}
                        </small>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default ChatHead; 