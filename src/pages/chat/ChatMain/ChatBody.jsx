import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { getMessagesByConversationId } from '../../../services/api';

const ChatBody = ({ messages: initialMessages, currentUserId, myAvatar, otherAvatar, conversationId }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const chatBodyRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages(initialMessages);
        setPage(1);
        setHasMore(true);
    }, [initialMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll xuống khi có tin nhắn mới
    useEffect(() => {
        if (page === 1) { // Chỉ scroll to bottom khi là tin nhắn mới
            scrollToBottom();
        }
    }, [messages, page]);

    const handleScroll = async (e) => {
        const element = e.target;
        if (element.scrollTop === 0 && !loading && hasMore) {
            try {
                setLoading(true);
                const nextPage = page + 1;
                const scrollHeightBeforeLoad = element.scrollHeight;
                
                const response = await getMessagesByConversationId(conversationId, nextPage);

                console.log(response);
                
                if (response.data && response.data.length > 0) {
                    setMessages(prevMessages => [...response.data, ...prevMessages]);
                    setPage(nextPage);
                    
                    // Giữ nguyên vị trí scroll sau khi load thêm tin nhắn
                    setTimeout(() => {
                        const newScrollHeight = element.scrollHeight;
                        const scrollOffset = newScrollHeight - scrollHeightBeforeLoad;
                        element.scrollTop = scrollOffset;
                    }, 0);

                    if (nextPage >= response.total_pages) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error loading more messages:', error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        }
    };

    // Sắp xếp messages theo thời gian cũ đến mới
    const sortedMessages = [...messages].sort((a, b) => 
        moment(a.created_at).valueOf() - moment(b.created_at).valueOf()
    );

    return (
        <div 
            className="card-body chat-body bg-body"
            ref={chatBodyRef}
            onScroll={handleScroll}
            style={{ overflowY: 'auto'}}
        >
            {/* Loading indicator at top */}
            {loading && (
                <div className="text-center p-2">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        Loading more messages...
                    </div>
                </div>
            )}

            <div className="chat-day-title">
                <span className="main-title">Feb 2,2024</span>
            </div>
            
            {sortedMessages.map((message) => (
                <div 
                    key={message.id} 
                    className={`iq-message-body ${message.sender_id === currentUserId ? 'iq-current-user' : 'iq-other-user'}`}
                >
                    <div className="chat-profile text-center">
                        <img 
                            src={message.sender_id === currentUserId ? myAvatar : otherAvatar} 
                            alt="chat-user" 
                            className="avatar-40 rounded-pill" 
                            loading="lazy"
                        />
                        <small className="iq-chating p-0 mb-0 d-block">
                            {moment(message.created_at).format('HH:mm')}
                        </small>
                    </div>
                    <div className="iq-chat-text">
                        <div className={`d-flex align-items-center ${message.sender_id === currentUserId ? 'justify-content-end' : 'justify-content-start'} gap-md-2`}>
                            <div className="iq-chating-content d-flex align-items-center">
                                <p className="mr-2 mb-0">{message.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatBody; 