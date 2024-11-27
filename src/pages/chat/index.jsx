import ChatSidebar from './ChatSidebar/ChatSidebar.jsx';
import ChatMain from './ChatMain/ChatMain.jsx';
import Header from '../../components/Header';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Chat = () => {
    const { userProfile } = useSelector((state) => state.account);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [avatarActiveConversation, setAvatarActiveConversation] = useState(null);
    const [infoActiveConversation, setInfoActiveConversation] = useState(null);

    const handleConversationClick = (conversationId) => {
        setActiveConversationId(conversationId);
    };

    return (
        <>
            <Header />
            <div className="iq-chat-theme">
                <ChatSidebar 
                    activeConversationId={activeConversationId}
                    onConversationClick={handleConversationClick}
                    setAvatarActiveConversation={setAvatarActiveConversation}
                    setInfoActiveConversation={setInfoActiveConversation}
                    userProfile={userProfile}
                />
                <ChatMain 
                    conversationId={activeConversationId}
                    userProfile={userProfile}
                    avatarActiveConversation={avatarActiveConversation}
                    infoActiveConversation={infoActiveConversation}
                />
            </div>
        </>
    );
};

export default Chat;