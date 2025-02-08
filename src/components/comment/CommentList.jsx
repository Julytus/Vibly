import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import { getPostComments, addComment, deleteComment } from '../../services/api';
import { useSelector } from 'react-redux';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [newComment, setNewComment] = useState('');
    const userProfile = useSelector((state) => state.account.userProfile);

    const fetchComments = async (pageNum) => {
        try {
            setLoading(true);
            const response = await getPostComments(postId, pageNum);
            if (pageNum === 1) {
                // Nếu là trang đầu tiên, thay thế toàn bộ comments
                setComments(response.data);
            } else {
                // Nếu load more, thêm comments mới vào cuối danh sách
                setComments(prev => [...prev, ...response.data]);
            }
            setHasMore(pageNum < response.total_pages);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setComments([]);
        setPage(1);
        setHasMore(true);
        fetchComments(1);
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await addComment(
                userProfile.first_name,
                userProfile.last_name,
                userProfile.avatar,
                newComment, postId);
            setComments(prev => [response, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <>
            {/* First Comment Card */}
            <ul className="post-comments p-2 card rounded">
                {comments.slice(0, 1).map(comment => (
                    <CommentItem 
                        key={comment.id} 
                        comment={comment}
                        showReplies={true}
                        onDelete={async (commentId) => {
                            try {
                                await deleteComment(commentId);
                                setComments(prev => 
                                    prev.filter(c => c.id !== commentId)
                                );
                            } catch (error) {
                                console.error('Error deleting comment:', error);
                            }
                        }}
                    />
                ))}
            </ul>

            {/* Main Comments Card with Replies */}
            <ul className="post-comments p-2 m-0 card rounded">
                {comments.slice(1).map(comment => (
                    <CommentItem 
                        key={comment.id} 
                        comment={comment}
                        showReplies={true}
                        onDelete={async (commentId) => {
                            try {
                                await deleteComment(commentId);
                                setComments(prev => 
                                    prev.filter(c => c.id !== commentId)
                                );
                            } catch (error) {
                                console.error('Error deleting comment:', error);
                            }
                        }}
                    />
                ))}
            </ul>

            {/* New Comment Input */}
            <ul className="post-comments p-2 mt-4">
                <li className="d-flex align-items-center">
                    <input 
                        type="text" 
                        className="form-control rounded"
                        placeholder="Write your comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div 
                        className="comment-attagement d-flex align-items-center me-5 pe-2 cursor-pointer"
                        onClick={handleAddComment}
                    >
                        <span className="material-symbols-outlined md-18 me-1">
                            comment
                        </span>
                        <h6 className="card-text-1 me-2">Comment</h6>
                    </div>
                </li>
            </ul>

            {/* Load More Comments */}
            {hasMore && !loading && (
                <div className="text-center mt-4">
                    <p onClick={() => {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        fetchComments(nextPage);
                    }} style={{ cursor: 'pointer' }}>
                        Show more comments
                    </p>
                </div>
            )}
            {loading && (
                <div className="text-center mt-4">
                    <p>Loading...</p>
                </div>
            )}
        </>
    );
};

export default CommentList; 