import React, { useEffect, useState, useRef } from 'react';
import loader from '/images/page-img/page-load-loader.gif';
import { getPostsByUserId } from '../../services/api';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import { dateHandler } from '../../utils/date';
import TextWithTags from '../../components/ContentWithTags/TextWithTags';

const PostProfile = ({
    firstName,
    lastName,
    avatar,
    userId,
    newPost,
    postLoading
}) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading3, setLoading3] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);

    const loadMorePosts = async () => {
        if (loading3 || !hasMore) return;
        
        try {
            setLoading3(true);
            const nextPage = page + 1;
            // Delay 1s cho loading, để test hiển thị loader
            // await new Promise(resolve => setTimeout(resolve, 1000));
            
            const response = await getPostsByUserId(userId, nextPage);
            
            if (response.data && response.data.length > 0) {
                setPosts(prevPosts => [...prevPosts, ...response.data]);
                setPage(nextPage);
                if (nextPage >= response.total_pages) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
            setHasMore(false);
        } finally {
            setLoading3(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !loading3) {
                    loadMorePosts();
                }
            },
            { threshold: 0.1 }
        );

        const currentLoader = loaderRef.current;
        
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [loading3, hasMore, page, userId]);

    useEffect(() => {
        if (newPost) {
            console.log('Original newPost:', newPost);
            if (postLoading) {
                return;
            }
            setPosts(prevPosts => {
                const formattedNewPost = {
                    id: newPost.id,
                    content: newPost.content,
                    created_at: newPost.createdAt,
                    image_urls: newPost.imageUrls,
                    isNew: true
                };
                console.log('Formatted newPost:', formattedNewPost);
                return [formattedNewPost, ...prevPosts];
            });
        }
    }, [newPost, postLoading]);

    return (
        <>
            {posts && posts.map((post) => (
                <div className="card mb-4" key={post.id}>
                    <div className="card-body">
                        <ul className="post-comments p-0 m-0">
                            <li className="mb-2">
                                <div className="d-flex justify-content-between">
                                    <div className="user-img me-3">
                                        <img src={avatar} alt="userimg" className="avatar-60 rounded-circle img-fluid" loading="lazy" />
                                    </div>
                                    <div className="w-100 text-margin">
                                        <h5>{firstName} {lastName}</h5>
                                        <small className="d-flex align-items-center">
                                            <i className="material-symbols-outlined md-14 me-1">schedule</i> 
                                            {post.isNew ? 'Just now' : dateHandler(post.created_at)}
                                        </small>
                                        <TextWithTags content={post.content} />
                                        {post.image_urls && <ImageGallery imageUrls={post.image_urls} />}
                                        <hr />
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center me-3">
                                                    <span className="material-symbols-outlined md-18">favorite_border</span>
                                                    <span className="card-text-1 ms-1">Love it</span>
                                                </div>
                                                <div className="d-flex align-items-center me-3">
                                                    <span className="material-symbols-outlined md-18">comment</span>
                                                    <span className="card-text-1 ms-1">Comment</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="material-symbols-outlined md-18">share</span>
                                                    <span className="card-text-1 ms-1">Share</span>
                                                </div>
                                            </div>
                                            <span className="card-text-2">5.2k people love it</span>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="card-text-1 me-1">5.2k people love it</span>
                                                <div className="iq-media-group ms-2">
                                                    <a href="#" className="iq-media">
                                                        <img className="img-fluid avatar-30 rounded-circle" src={avatar} alt="" loading="lazy" />
                                                    </a>
                                                    <a href="#" className="iq-media">
                                                        <img className="img-fluid avatar-30 rounded-circle" src={avatar} alt="" loading="lazy" />
                                                    </a>
                                                    <a href="#" className="iq-media">
                                                        <img className="img-fluid avatar-30 rounded-circle" src={avatar} alt="" loading="lazy" />
                                                    </a>
                                                    <a href="#" className="iq-media">
                                                        <img className="img-fluid avatar-30 rounded-circle" src={avatar} alt="" loading="lazy" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            ))}

            {hasMore && (
                <div className="card mb-4" ref={loaderRef}>
                    <div className="row">
                        <div className="scroller-status col-sm-12 text-center p-3">
                            <div className="infinite-scroll-request loader-ellips">
                                <img 
                                    src={loader} 
                                    alt="loader" 
                                    style={{ height: '100px' }} 
                                    loading="lazy" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostProfile;