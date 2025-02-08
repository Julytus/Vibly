import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dateHandler } from '../../utils/date';
import { getBasicProfileById, addComment } from '../../services/api';
import { useSelector } from 'react-redux';

const CommentItem = ({ comment, onDelete, showReplies = false, isReply = false }) => {
    const navigate = useNavigate();
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState(comment.replies || []);
    const userProfile = useSelector((state) => state.account.userProfile);
    const [userInfo, setUserInfo] = useState({
        first_name: '',
        last_name: '',
        avatar: ''
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await getBasicProfileById(comment.userId);
                setUserInfo({
                    first_name: response.first_name,
                    last_name: response.last_name,
                    avatar: response.avatar
                });
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [comment.userId]);

    const handleUserClick = () => {
        navigate(`/profile/${comment.userId}`);
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;

        try {
            const response = await addComment(
                    userProfile.first_name,
                    userProfile.last_name,
                    userProfile.avatar, 
                    replyText, 
                    comment.postId, 
                    comment.id);
            setReplies(prev => [...prev, response]);
            setReplyText('');
            setShowReplyInput(false);
        } catch (error) {
            console.error('Error replying to comment:', error);
        }
    };

    return (
        <li className="mb-2">
            <div className="d-sm-flex justify-content-between">
                <div className="user-img me-3">
                    <img 
                        src={userInfo.avatar} 
                        alt="userimg" 
                        className="avatar-60 rounded-circle img-fluid" 
                        loading="lazy"
                    />
                </div>
                <div className="w-100 text-margin mt-sm-0 mt-2">
                    <div className="">
                        <h5 
                            className="mb-0 d-inline-block me-1"
                            onClick={handleUserClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {userInfo.first_name} {userInfo.last_name}
                        </h5>
                        <small className="mb-0 d-inline-block">{dateHandler(comment.createdAt)}</small>
                    </div>
                    <p>{comment.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center me-3">
                                <span className="material-symbols-outlined md-18">
                                    favorite_border
                                </span>
                                <span className="card-text-1 ms-1">Love it</span>
                            </div>
                            {!isReply && (
                                <div className="d-flex align-items-center me-3" onClick={() => setShowReplyInput(!showReplyInput)}>
                                    <span className="material-symbols-outlined md-18 cursor-pointer">
                                        comment
                                    </span>
                                    <span className="card-text-1 ms-1 cursor-pointer">Reply</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nested Comments */}
                    {showReplies && replies.length > 0 && (
                        <ul className="post-comments p-0 mt-4">
                            {replies.map(reply => (
                                <CommentItem 
                                    key={reply.id} 
                                    comment={reply}
                                    onDelete={onDelete}
                                    isReply={true}
                                />
                            ))}
                        </ul>
                    )}

                    {/* Reply Input - Only show for main comments */}
                    {!isReply && showReplyInput && (
                        <div className="d-flex align-items-center mt-3">
                            <input 
                                type="text" 
                                className="form-control rounded"
                                placeholder="Write your reply"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div 
                                className="comment-attagement d-flex align-items-center me-5 pe-2 cursor-pointer"
                                onClick={handleReply}
                            >
                                <span className="material-symbols-outlined md-18 me-1">
                                    comment
                                </span>
                                <h6 className="card-text-1">Reply</h6>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

export default CommentItem; 