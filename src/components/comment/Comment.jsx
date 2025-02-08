import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { dateHandler } from '../../utils/date';

const CommentItem = ({ comment, onReply, level = 0 }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onReply(comment.id, replyText);
            setReplyText('');
            setShowReplyInput(false);
        }
    };

    return (
        <li className="mb-2">
            <div className="d-sm-flex justify-content-between">
                <div className="user-img me-3">
                    <img 
                        src={comment.avatar} 
                        alt="userimg" 
                        className="avatar-6co0 rounded-circle img-fluid" 
                        loading="lazy" 
                    />
                </div>
                <div className="w-100 text-margin mt-sm-0 mt-2">
                    <div className="">
                        <h5 className="mb-0 d-inline-block me-1">{comment.first_name} {comment.last_name}</h5>
                        <small className="mb-0 d-inline-block">{dateHandler(comment.created_at)}</small>
                    </div>
                    <p>{comment.content}</p>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center me-3">
                                <span className="material-symbols-outlined md-18">
                                    favorite_border
                                </span>
                                <span className="card-text-1 ms-1">Love it</span>
                            </div>
                            <div className="d-flex align-items-center me-3" onClick={() => setShowReplyInput(!showReplyInput)}>
                                <span className="material-symbols-outlined md-18">
                                    comment
                                </span>
                                <span className="card-text-1 ms-1">Reply</span>
                            </div>
                        </div>
                    </div>

                    {showReplyInput && (
                        <div className="d-flex align-items-center mt-3">
                            <input 
                                type="text" 
                                className="form-control rounded"
                                placeholder="Write your reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="comment-attagement d-flex align-items-center me-5 pe-2 cursor-pointer" onClick={handleReplySubmit}>
                                <span className="material-symbols-outlined md-18 me-1">
                                    send
                                </span>
                                <h6 className="card-text-1">Reply</h6>
                            </div>
                        </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <ul className="post-comments p-0 mt-4">
                            {comment.replies.map((reply) => (
                                <CommentItem 
                                    key={reply.id} 
                                    comment={reply} 
                                    onReply={onReply}
                                    level={level + 1}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </li>
    );
};

const Comment = ({ postId }) => {
    const userProfile = useSelector((state) => state.account.userProfile);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            // API call to submit comment
            setNewComment('');
        }
    };

    return (
        <>
            {comments.length > 0 && !showAllComments && (
                <div className="text-center mt-4">
                    <p onClick={() => setShowAllComments(true)} style={{ cursor: 'pointer' }}>
                        Show {comments.length} comments
                    </p>
                </div>
            )}

            {showAllComments && (
                <ul className="post-comments p-2 card rounded">
                    {comments.map((comment) => (
                        <CommentItem 
                            key={comment.id} 
                            comment={comment}
                            onReply={(commentId, replyText) => {
                                // Handle reply submission
                            }}
                        />
                    ))}
                </ul>
            )}

            <ul className="post-comments p-2 mt-4">
                <li className="d-flex align-items-center">
                    <input 
                        type="text" 
                        className="form-control rounded"
                        placeholder="Write your comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="comment-attagement d-flex align-items-center me-5 pe-2 cursor-pointer" onClick={handleCommentSubmit}>
                        <span className="material-symbols-outlined md-18 me-1">
                            comment
                        </span>
                        <h6 className="card-text-1 me-2">Comment</h6>
                    </div>
                </li>
            </ul>
        </>
    );
};

export default Comment; 