import { useEffect, useState } from 'react';
import { getBasicProfileById, getAvatarById } from '../../../services/api';
import { dateHandler } from '../../../utils/date';

const Conversation = ({ 
    conversation, 
    currentUserId, 
    isActive, 
    onConversationClick, 
}) => {
    const [otherUser, setOtherUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const otherUserId = conversation.userId.find(id => id !== currentUserId);
                const userData = await getBasicProfileById(otherUserId);
                setOtherUser(userData);
                
                const avatar = await getAvatarById(otherUserId);
                setAvatarUrl(avatar);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [conversation, currentUserId]);

    if (!otherUser) {
        return null;
    }

    const handleConversationClick = async (e) => {
        e.preventDefault();
        onConversationClick(conversation.id);
    }

    return (
        <li className={`nav-item iq-chat-list mb-3 ps-0 ${isActive ? 'active' : ''}`} role="presentation">
            <a 
                href="#" 
                className={`nav-link d-flex gap-3 rounded-2 zoom-in ${isActive ? 'active' : ''}`} 
                onClick={handleConversationClick}
            >
                <div className="position-relative">
                    <img 
                        src={avatarUrl} 
                        alt={`avatar-${otherUser.username}`} 
                        className="avatar-48 object-cover rounded-circle" 
                    />
                    <div className="iq-profile-badge bg-success"></div>
                </div>
                <div className="d-flex align-items-top w-100 iq-userlist-data">
                    <div className="d-flex flex-grow-1 flex-column">
                        <div className="d-flex align-items-center gap-1">
                            <h6 className="mb-0 iq-userlist-name font-size-14 fw-semibold text-ellipsis short-1 flex-grow-1">
                                {otherUser.first_name} {otherUser.last_name}
                            </h6>
                            <span className="mb-0 font-size-12">
                                {conversation.lastMessage && dateHandler(conversation.lastMessage.created_at)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <p className="text-ellipsis short-1 flex-grow-1 font-size-14 mb-0">
                                {conversation.lastMessage?.content || 'Start a conversation'}
                            </p>
                        </div>
                    </div>
                </div>
            </a>
        </li>
    );
}

export default Conversation;