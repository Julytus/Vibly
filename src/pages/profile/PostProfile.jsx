import React, { useEffect, useState, useRef } from 'react';
import loader from '/images/page-img/page-load-loader.gif';
import { getPostsByUserId } from '../../services/api';
import Post from '../../components/Post/Post';

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
        if (newPost && !postLoading) {
            setPosts(prevPosts => {
                const formattedNewPost = {
                    id: newPost.id,
                    content: newPost.content,
                    created_at: newPost.createdAt,
                    image_urls: newPost.imageUrls,
                    userId: userId,
                    first_name: firstName,
                    last_name: lastName,
                    avatar: avatar,
                    comments_count: 0,
                    isNew: true
                };
                return [formattedNewPost, ...prevPosts];
            });
        }
    }, [newPost, postLoading, firstName, lastName, avatar, userId]);

    return (
        <>
            <ul className="post-comments p-0 m-0">
                {posts && posts.map((post) => (
                    <Post
                        key={post.id} 
                        post={post}
                    />
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

export default PostProfile;