import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PostCreation from './PostCreation';
import PostProfile from './PostProfile';

const Description = ({ otherProfile }) => {
    const userProfile = useSelector((state) => state.account.userProfile);
    const {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        avatar
    } = userProfile;

    // Chuyển các state liên quan đến post từ PostCreation sang đây
    const [newPost, setNewPost] = useState(null);
    const [postLoading, setPostLoading] = useState(false);

    return (
        <div className="row">
            <div className="col-lg-4">
                <div className="card">
                    <div className="card-header d-flex justify-content-between border-bottom">
                        <div className="header-title">
                            <h4 className="card-title">Bio</h4>
                        </div>
                        <div className="d-flex align-items-center">
                            <p className="m-0"><a href="#"> Know More </a></p>
                        </div>
                    </div>
                    <div className="card-body">
                    </div>
                </div>
                <div className="fixed-suggestion mb-4">
                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between border-bottom">
                            <div className="header-title">
                                <h4 className="card-title">Photos</h4>
                            </div>
                            <a href="#">See all photos</a>
                        </div>
                        <div className="card-body">
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between border-bottom">
                            <div className="header-title">
                                <h4 className="card-title">Videos</h4>
                            </div>
                            <a href="#">See all videos</a>
                        </div>
                        <div className="card-body">
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-lg-8'>
                {userProfile.id === otherProfile.id && (
                    <PostCreation 
                        setNewPost={setNewPost}
                        setPostLoading={setPostLoading}
                    />
                )}
                <PostProfile
                    firstName={otherProfile.first_name}
                    lastName={otherProfile.last_name}
                    avatar={otherProfile.avatar}
                    userId={otherProfile.id}
                    newPost={newPost}
                    postLoading={postLoading}
                />
            </div>
        </div>
    );
};

export default Description;