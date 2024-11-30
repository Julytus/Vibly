import ChatHead from './ChatHead.jsx';
import ChatBody from './ChatBody.jsx'; 
import ChatFooter from './ChatFooter.jsx';
import { getMessagesByConversationId, getAvatarById, getBasicProfileById, getConversationById } from '../../../services/api';
import { useEffect, useState } from 'react';
import { webSocketService } from '../../../services/websocket';

const ChatMain = ({ 
    conversationId, 
    userProfile, 
}) => {
    const [messages, setMessages] = useState([]);
    const [myAvatar, setMyAvatar] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch conversation và user data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch conversation first
                const conversationData = await getConversationById(conversationId);

                if (conversationData) {
                    // Tìm ID của user khác trong conversation
                    const otherUserId = conversationData.userId.find(id => id !== userProfile.id);
                    
                    // Fetch user data và avatar parallel
                    const [userData, avatar, myAvatarUrl] = await Promise.all([
                        getBasicProfileById(otherUserId),
                        getAvatarById(otherUserId),
                        getAvatarById(userProfile.id)
                    ]);

                    setOtherUser(userData);
                    setAvatarUrl(avatar);
                    setMyAvatar(myAvatarUrl);

                    // Fetch messages
                    const messagesResponse = await getMessagesByConversationId(conversationId);
                    setMessages(messagesResponse.data);
                    
                    // Chỉ kết nối WebSocket khi fetch data thành công
                    connectWebSocket();
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Ngắt kết nối WebSocket nếu có lỗi
                webSocketService.unsubscribeFromConversation(conversationId);
                webSocketService.disconnect();
            } finally {
                setIsLoading(false);
            }
        };

        if (conversationId) {
            fetchData();
        }

        // Cleanup function
        return () => {
            webSocketService.unsubscribeFromConversation(conversationId);
            webSocketService.disconnect();
        };
    }, [conversationId, userProfile.id]);

    // Tách logic WebSocket thành function riêng
    const connectWebSocket = () => {
        webSocketService.connect(() => {            
            webSocketService.subscribeToConversation(conversationId, (message) => {
                console.log("message socket", message);
                setMessages(prevMessages => {
                    const messageExists = prevMessages.some(msg => msg.id === message.id);
                    if (!messageExists) {
                        return [...prevMessages, message];
                    }
                    return prevMessages;
                });
            });
        });
    };

    if (isLoading) {
        return <div className="main-content">
            <div className="container-fluid content-inner p-0">
                <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>;
    }

    return (
        <div className="main-content">
            {conversationId && otherUser && (
                <div className="container-fluid content-inner p-0 h-100" id="page_layout">
                    <div className="tab-content h-100" id="myTabContent">
                        <div className="card tab-pane mb-0 fade active show h-100" id="user-content-102" role="tabpanel" >
                            <ChatHead 
                                otherUser={otherUser}
                                otherAvatar={avatarUrl}
                            />
                            <ChatBody 
                                messages={messages} 
                                currentUserId={userProfile.id}
                                myAvatar={myAvatar}
                                otherAvatar={avatarUrl}
                                conversationId={conversationId}
                            />
                            <ChatFooter 
                                conversationId={conversationId}
                                currentUserId={userProfile.id}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatMain;