import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { likePost, unlikePost, getPostLikers } from '../../services/api';

const PostInteractions = ({ postId, onCommentClick }) => {
    const userProfile = useSelector((state) => state.account.userProfile);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likers, setLikers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLikers = async () => {
            try {
                const response = await getPostLikers(postId);
                setLikers(response.data || []);
                setLikeCount(response.total_elements);
                setIsLiked(response.data.some(liker => liker.userId === userProfile.id));
            } catch (error) {
                console.error('Error fetching likers:', error);
            }
        };

        fetchLikers();
    }, [postId, userProfile.id]);

    const handleLikeClick = async () => {
        if (loading) return;
        
        setLoading(true);
        try {
            if (!isLiked) {
                await likePost(
                    postId, 
                    userProfile.first_name,
                    userProfile.last_name,
                    userProfile.avatar
                );
                setLikers(prev => [{
                    userId: userProfile.id,
                    avatar: userProfile.avatar,
                    first_name: userProfile.first_name,
                    last_name: userProfile.last_name
                }, ...prev]);
                setLikeCount(prev => prev + 1);
            } else {
                await unlikePost(postId);
                setLikers(prev => prev.filter(liker => liker.userId !== userProfile.id));
                setLikeCount(prev => prev - 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error handling like:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center me-3" onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
                    <span 
                        className="material-symbols-outlined md-18" 
                        style={{ 
                            color: isLiked ? '#ff0000' : '#8a8a8a',
                            fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0"
                        }}
                    >
                        favorite
                    </span>
                    <span className="card-text-1 ms-1">Love it</span>
                </div>
                <div className="d-flex align-items-center me-3" onClick={onCommentClick}>
                    <span className="material-symbols-outlined md-18 cursor-pointer">comment</span>
                    <span className="card-text-1 ms-1 cursor-pointer">Comment</span>
                </div>
            </div>
            {likeCount > 0 && (
                <div className="d-flex justify-content-between align-items-center">
                    <span className="card-text-1 me-1">
                        {likeCount} {likeCount === 1 ? 'person loves' : 'people love'} it
                    </span>
                    <div className="iq-media-group ms-2">
                        {likers.slice(0, 4).map((liker, index) => (
                            <a key={liker.id || index} className="iq-media">
                                <img 
                                    className="img-fluid avatar-30 rounded-circle" 
                                    src={liker.avatar} 
                                    alt={`${liker.first_name} ${liker.last_name || ''}`}
                                    loading="lazy"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostInteractions; 