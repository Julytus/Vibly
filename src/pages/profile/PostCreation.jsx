import React, { useState } from 'react';
import img7 from '../../styles/images/small/07.png';
import img8 from '../../styles/images/small/08.png';
import img9 from '../../styles/images/small/09.png';
import { createPost } from '../../services/api';
import PostProfile from './PostProfile';
import { useParams } from 'react-router-dom';


const PostCreation = ({
    posts,
    currentPage,
    totalPages,
    avatar,
    firstName,
    lastName,
    userId
}) => {
    const [postContent, setPostContent] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading2, setLoading2] = useState(false);

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
                images: selectedImages
            };
            const newPost = await createPost(formData);
            setLoading2(false);
            console.log("newPost:", newPost);

        } catch (error) {
            console.error('Error creating post:', error);
            setLoading2(false);
        }
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

                                {/* Hiển thị preview ảnh */}
                                {previewImages.length > 0 && (
                                    <div className="selected-images mt-3">
                                        <div className="d-flex flex-wrap gap-2">
                                            {previewImages.map((preview, index) => (
                                                <div key={index} className="position-relative" style={{ width: '100px', height: '100px' }}>
                                                    <img
                                                        src={preview}
                                                        alt={`preview ${index}`}
                                                        className="img-fluid rounded"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                        onClick={() => removeImage(index)}
                                                        style={{ padding: '2px 6px' }}
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
                posts = {posts}
            />
        </div>
    );
};

export default PostCreation;