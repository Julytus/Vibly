import OnlineUser from '../OnlineUser.jsx';
import Conversation from './Conversation.jsx';
import { useEffect, useState, useCallback } from 'react';
import { getConversationsByUserId } from '../../../services/api';
import Loading from '../../../components/loading';

const ChatSidebar = (
    { activeConversationId, 
        onConversationClick, 
        userProfile 
    }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Tách handler ra thành callback để tránh tạo lại mỗi lần render
    const handleNewMessage = useCallback((notification) => {
        console.log('[ChatSidebar] Processing new message:', notification);
        setConversations(prevConversations => {
            const updatedConversations = prevConversations.map(conv => {
                if (conv.id === notification.conversation_id) {
                    console.log('[ChatSidebar] Updating conversation:', conv.id);
                    return {
                        ...conv,
                        lastMessage: {
                            content: notification.content,
                            created_at: notification.created_at,
                            sender_id: notification.sender_id,
                            isUnread: conv.id !== activeConversationId
                        }
                    };
                }
                return conv;
            });

            return updatedConversations.sort((a, b) => {
                const timeA = a.lastMessage?.created_at || a.created_at;
                const timeB = b.lastMessage?.created_at || b.created_at;
                return new Date(timeB) - new Date(timeA);
            });
        });
    }, [activeConversationId]);

    // Effect cho việc fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const response = await getConversationsByUserId(userProfile.id);
                setConversations(response.data);
            } catch (error) {
                console.error('API getConversationsByUserId, Error:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchConversations();
    }, [userProfile.id]);

    // Đăng ký handler với App
    useEffect(() => {
        window.chatSidebarHandler = handleNewMessage;
        
        return () => {
            window.chatSidebarHandler = null;
        };
    }, [handleNewMessage]);

    if (loading) {
        return <Loading />;
    }

    return (
        <aside className="sidebar sidebar-chat sidebar-base border-end shadow-none" 
               style={{
                   top: '75px',
                   height: 'calc(100vh - 75px)'
               }} 
               data-sidebar="responsive">
            <div className="chat-search pt-4 px-4">
                <h5 className="fw-500">Chats</h5>
                
                {/* Search bar */}
                <div className="chat-searchbar mt-3 pt-1 mb-4">
                    <div className="form-group chat-search-data m-0">
                        <input type="text" className="form-control round" id="chat-search" placeholder="Search for messages or users..." />
                        <i className="material-symbols-outlined">
                            search
                        </i>
                    </div>
                </div>

                {/* Online Users */}
                <OnlineUser currentUserId={userProfile.id} />

                {/* Conversation list */}
                <div className="sidebar-body pt-0 data-scrollbar mb-5 pb-5 px-4">
                    <ul className="nav navbar-nav iq-main-menu mb-5 pb-5" id="sidebar-menu" role="tablist">
                        <h6 className="mb-3 pb-1">Recent Chats</h6>

                        {/* Conversation item */}
                        {conversations.map((conversation) => (
                            <Conversation 
                                key={conversation.id} 
                                conversation={conversation}
                                currentUserId={userProfile.id}
                                isActive={activeConversationId === conversation.id}
                                onConversationClick={onConversationClick}
                            />
                        ))}
                        {/* Add more chat items here */}
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default ChatSidebar;