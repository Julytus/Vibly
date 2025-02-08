import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import loader from '/images/page-img/page-load-loader.gif';
import { getTimeline } from '../../services/api';
import Post from '../../components/Post/Post';

const PostTimeline = ({
    newPost,
    postLoading
}) => {
    const userProfile = useSelector((state) => state.account.userProfile);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading3, setLoading3] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);

    useEffect(() => {
        const loadInitialPosts = async () => {
            try {
                setLoading3(true);
                const response = await getTimeline(userProfile.id, 0);
                
                if (response && response.length > 0) {
                    setPosts(response);
                    setPage(0);
                    if (response.length < 10) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error loading initial timeline:', error);
                setHasMore(false);
            } finally {
                setLoading3(false);
            }
        };

        if (userProfile.id) {
            loadInitialPosts();
        }
    }, [userProfile.id]);

    const loadMorePosts = async () => {
        if (loading3 || !hasMore) return;
        
        try {
            setLoading3(true);
            const nextPage = page + 1;
            
            const response = await getTimeline(userProfile.id, nextPage);
            
            if (response && response.length > 0) {
                setPosts(prevPosts => [...prevPosts, ...response]);
                setPage(nextPage);
                if (response.length < 10) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading timeline:', error);
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
    }, [loading3, hasMore, userProfile.id]);

    useEffect(() => {
        if (newPost && !postLoading) {
            setPosts(prevPosts => [{
                id: newPost.id,
                content: newPost.content,
                created_at: newPost.createdAt,
                image_urls: newPost.imageUrls,
                userId: userProfile.id,
                isNew: true
            }, ...prevPosts]);
        }
    }, [newPost, postLoading]);

    return (
        <>
            <ul className="post-comments p-0 m-0">
                {posts && posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </ul>

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

export default PostTimeline;