import ChatSidebar from './ChatSidebar/ChatSidebar.jsx';
import ChatMain from './ChatMain/ChatMain.jsx';
import Header from '../../components/header';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SettingPanel from '../../components/SettingPanel';
const Chat = () => {
    const { userProfile } = useSelector((state) => state.account);
    const { activeConversationId } = useParams() || null;
    const navigate = useNavigate();

    const handleConversationClick = (conversationId) => {
        navigate(`/chat/${conversationId}`);
    };

    return (
        <>
            <Header />
            <SettingPanel />
            <div className="iq-chat-theme">
                <ChatSidebar 
                    activeConversationId={activeConversationId}
                    onConversationClick={handleConversationClick}
                    userProfile={userProfile}
                />
                <ChatMain 
                    conversationId={activeConversationId}
                    userProfile={userProfile}
                />
            </div>
        </>
    );
};

export default Chat;