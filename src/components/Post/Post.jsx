import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dateHandler } from '../../utils/date';
import PostInteractions from '../PostInteractions/PostInteractions';
import CommentList from '../../components/Comment/CommentList';
import TextWithTags from '../ContentWithTags/TextWithTags';
import { getBasicProfileById } from '../../services/api';

const Post = ({ post }) => {
    const navigate = useNavigate();
    const [showComments, setShowComments] = useState(false);
    const [userInfo, setUserInfo] = useState({
        first_name: '',
        last_name: '',
        avatar: ''
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await getBasicProfileById(post.userId);
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
    }, [post.userId]);

    const handleUserClick = () => {
        navigate(`/profile/${post.userId}`);
    };

    return (
        <div className='card'>
        <div className='card-body'>
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
                        <small className="d-flex align-items-center">
                            <i className="material-symbols-outlined md-16 me-1">
                                schedule
                            </i> 
                            {dateHandler(post.created_at)}
                        </small>
                    </div>
                    <TextWithTags content={post.content} />
                    <hr />
                    
                    {/* Post Interactions Component */}
                    <PostInteractions 
                        postId={post.id} 
                        onCommentClick={() => setShowComments(true)}
                    />

                    {/* Comments List */}
                    {showComments && <CommentList postId={post.id} />}
                </div>
            </div>
        </li>
        </div>
        </div>


    );
};

export default Post; 