import ChatHead from './ChatHead.jsx';
import ChatBody from './ChatBody.jsx'; 
import ChatFooter from './ChatFooter.jsx';
import SettingPanel from '../../../components/SettingPanel/index.jsx';
import { getMessagesByConversationId, getAvatarById } from '../../../services/api';
import { useEffect, useState } from 'react';

const ChatMain = ({ 
    conversationId, 
    userProfile, 
    avatarActiveConversation,
    infoActiveConversation 
}) => {
    const [messages, setMessages] = useState([]);
    const [myAvatar, setMyAvatar] = useState(null);

    // Fetch messages
    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await getMessagesByConversationId(conversationId);
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        }

        if (conversationId) {
            getMessages();
        }
    }, [conversationId]);

    // Fetch my avatar
    useEffect(() => {
        const fetchMyAvatar = async () => {
            try {
                const myAvatarUrl = await getAvatarById(userProfile.id);
                setMyAvatar(myAvatarUrl);
            } catch (error) {
                console.error('Error fetching my avatar:', error);
            }
        };

        fetchMyAvatar();
    }, [userProfile.id]);

    const handleMessageSent = (newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    return (
        <div className="main-content">
            <SettingPanel />
            {conversationId && (
                <div className="container-fluid content-inner p-0 h-100" id="page_layout">
                    <div className="tab-content h-100" id="myTabContent">
                        <div className="card tab-pane mb-0 fade active show h-100" id="user-content-102" role="tabpanel" >
                            <ChatHead 
                                otherUser={infoActiveConversation}
                                otherAvatar={avatarActiveConversation}
                            />
                            <ChatBody 
                                messages={messages} 
                                currentUserId={userProfile.id}
                                myAvatar={myAvatar}
                                otherAvatar={avatarActiveConversation}
                                conversationId={conversationId}
                            />
                            <ChatFooter 
                                conversationId={conversationId}
                                currentUserId={userProfile.id}
                                onMessageSent={handleMessageSent}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatMain;