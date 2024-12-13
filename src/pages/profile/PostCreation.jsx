import React, { useState } from 'react';
import img7 from '/images/small/07.png';
import img8 from '/images/small/08.png';
import img9 from '/images/small/09.png';
import { createPost } from '../../services/api';
import PostProfile from './PostProfile';
import '../../components/ImageGallery/imggrid.css';


const PostCreation = ({
    avatar,
    firstName,
    lastName,
    userId
}) => {
    const [postContent, setPostContent] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading2, setLoading2] = useState(false);
    const [newPost, setNewPost] = useState(null);
    const [postLoading, setPostLoading] = useState(false);
    const [privacyLevel, setPrivacyLevel] = useState('PUBLIC');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Cho phép xuống dòng khi ấn Shift+Enter
                return;
            } else {
                // Ngăn chặn hành vi mặc định của form khi ấn Enter
                e.preventDefault();
                if (postContent.trim()) {
                    handleCreatePost(e);
                }
            }
        }
    };

    const handleSelectImages = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prevImages => [...prevImages, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);
    };


    const handleCreatePost = async (e) => {
        e.preventDefault();

        setPostLoading(true);

        // Reset form và đóng modal
        setPostContent('');
        setSelectedImages([]);
        setPreviewImages([]);
        setLoading2(true);

        const modal = document.getElementById('post-modal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
            modalInstance.hide();
        }

        try {
            const formData = {
                content: postContent,
                images: selectedImages,
                privacyLevel: privacyLevel
            };
            const newPost = await createPost(formData);
            setLoading2(false);

            // Cập nhật bài post với dữ liệu thật từ server
            setNewPost({
                ...newPost,
                isNew: true
            });
            setPostLoading(false);

            console.log("newPost:", newPost);

        } catch (error) {
            console.error('Error creating post:', error);
            setLoading2(false);


        }
    };

    const removeImage = (index) => {
        // Xóa ảnh khỏi mảng selectedImages
        setSelectedImages(prevImages => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });

        // Xóa ảnh preview
        setPreviewImages(prevPreviews => {
            const newPreviews = [...prevPreviews];
            // Giải phóng URL object để tránh rò rỉ bộ nhớ
            URL.revokeObjectURL(newPreviews[index]);
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    return (
        <div className="col-lg-8">
            <div id="post-modal-data" className="card mb-4">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Create Post</h4>
                    </div>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <div className="user-img me-3">
                            <img src={avatar} alt="userimg" className="avatar-60 rounded-circle" loading="lazy" />
                        </div>
                        <form className="post-text w-100" data-bs-toggle="modal" data-bs-target="#post-modal" action="#">
                            <input
                                type="text"
                                className="form-control rounded"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder={`What's on your mind, ${firstName}?`}
                                style={{ border: 'none' }}
                            />
                        </form>
                    </div>
                    <hr />
                    <ul className="post-opt-block d-flex list-inline m-0 p-0 flex-wrap gap-3">
                        <li className="bg-primary-subtle rounded p-2 pointer d-flex align-items-center">
                            <label htmlFor="image-upload-outside" className="d-flex align-items-center mb-0" style={{ cursor: 'pointer' }}>
                                <img src={img7} alt="icon" className="img-fluid me-2" loading="lazy" />
                                Photo/Video
                            </label>
                            <input
                                id="image-upload-outside"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleSelectImages}
                                style={{ display: 'none' }}
                                onClick={(e) => {
                                    const modal = new bootstrap.Modal(document.getElementById('post-modal'));
                                    modal.show();
                                }}
                            />
                        </li>
                        <li className="bg-primary-subtle rounded p-2 pointer d-flex align-items-center">
                            <img src={img8} alt="icon" className="img-fluid me-2" loading="lazy" /> Tag Friend
                        </li>
                        <li className="bg-primary-subtle rounded p-2 pointer d-flex align-items-center">
                            <img src={img9} alt="icon" className="img-fluid me-2" loading="lazy" /> Feeling/Activity
                        </li>
                        <li className="bg-primary-subtle rounded p-2 pointer text-center">
                            <div className="card-header-toolbar d-flex align-items-center">
                                <div className="dropdown">
                                    <div className="dropdown-toggle lh-1" id="post-option" data-bs-toggle="dropdown">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </div>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="post-option">
                                        <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#post-modal">Check in</a>
                                        <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#post-modal">Live Video</a>
                                        <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#post-modal">GIF</a>
                                        <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#post-modal">Watch Party</a>
                                        <a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#post-modal">Play with Friend</a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Modal */}
                <div className="modal fade" id="post-modal" tabIndex="-1" aria-labelledby="post-modalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-fullscreen-sm-down">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="post-modalLabel">Create Post</h5>
                                <a className="lh-1" data-bs-dismiss="modal">
                                    <span className="material-symbols-outlined">close</span>
                                </a>
                            </div>
                            <div className="modal-body">
                                {/* Modal content */}
                                <div className="d-flex align-items-center">
                                    <div className="user-img me-3">
                                        <img src={avatar} alt="userimg" className="avatar-60 rounded-circle img-fluid" loading="lazy" />
                                    </div>
                                    <form className="post-text w-100" onSubmit={handleCreatePost}>
                                        <textarea
                                            className="form-control rounded"
                                            placeholder={`What's on your mind, ${firstName}?`}
                                            style={{ border: 'none', resize: 'none', minHeight: '100px' }}
                                            value={postContent}
                                            onChange={(e) => setPostContent(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </form>
                                </div>

                                <div className="d-flex align-items-center mt-3">
                                    <div className="card-post-toolbar">
                                        <div className="dropdown">
                                            <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                <span className="btn btn-primary">
                                                    {privacyLevel === 'PUBLIC' ? 'Public' : 
                                                     privacyLevel === 'FRIENDS' ? 'Friends' : 'Only Me'}
                                                </span>
                                            </span>
                                            <div className="dropdown-menu m-0 p-0">
                                                <a className="dropdown-item p-3" href="#" onClick={(e) => {
                                                    e.preventDefault();
                                                    setPrivacyLevel('PUBLIC');
                                                }}>
                                                    <div className="d-flex align-items-top">
                                                        <span className="material-symbols-outlined">
                                                            public
                                                        </span>
                                                        <div className="data ms-2">
                                                            <h6>Public</h6>
                                                            <p className="mb-0">Anyone can see</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a className="dropdown-item p-3" href="#" onClick={(e) => {
                                                    e.preventDefault();
                                                    setPrivacyLevel('FRIENDS');
                                                }}>
                                                    <div className="d-flex align-items-top">
                                                        <span className="material-symbols-outlined">
                                                            group
                                                        </span>
                                                        <div className="data ms-2">
                                                            <h6>Friends</h6>
                                                            <p className="mb-0">Your friends on social network</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a className="dropdown-item p-3" href="#" onClick={(e) => {
                                                    e.preventDefault();
                                                    setPrivacyLevel('PRIVATE');
                                                }}>
                                                    <div className="d-flex align-items-top">
                                                        <span className="material-symbols-outlined">
                                                            lock
                                                        </span>
                                                        <div className="data ms-2">
                                                            <h6>Only Me</h6>
                                                            <p className="mb-0">Only you can see</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hiển thị preview ảnh */}
                                {previewImages.length > 0 && (
                                    <div className="selected-images mt-3">
                                        <div className="d-flex flex-wrap gap-2">
                                            {previewImages.map((preview, index) => (
                                                <div key={index} className="preview-image-container">
                                                    <img
                                                        src={preview}
                                                        alt={`preview ${index}`}
                                                    />
                                                    <button
                                                        className="preview-delete-btn"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <hr />
                                <ul className="d-flex flex-wrap align-items-center list-inline m-0 p-0">
                                    <li className="col-md-6 mb-3">
                                        <div className="bg-primary-subtle rounded p-2 pointer me-3">
                                            <label htmlFor="image-upload" className="d-flex align-items-center mb-0" style={{ cursor: 'pointer' }}>
                                                <img src={img7} alt="icon" className="img-fluid me-2" loading="lazy" />
                                                <span>Photo/Video</span>
                                            </label>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleSelectImages}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    </li>
                                </ul>
                                <hr />
                                <div className="other-option">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div className="user-img me-3">
                                                <img src={avatar} alt="userimg" className="avatar-60 rounded-circle img-fluid" loading="lazy" />
                                            </div>
                                            <h6>{firstName}'s Story</h6>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary d-block w-100 mt-3"
                                    onClick={handleCreatePost}
                                    disabled={loading2}
                                >
                                    {loading2 ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            Posting...
                                        </div>
                                    ) : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PostProfile
                firstName = {firstName}
                lastName = {lastName}
                avatar = {avatar}
                userId = {userId}
                newPost = {newPost}
                postLoading = {postLoading}
            />
        </div>
    );
};

export default PostCreation;