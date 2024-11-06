import React, { useState } from 'react';
import PostCreation from './PostCreation';

const Description = ({
    posts,
    currentPage,
    totalPages,
    firstName,
    lastName,
    avatar,
    userId
}) => {
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
            <PostCreation
                posts={posts}
                avatar={avatar}
                firstName={firstName}
                lastName={lastName}
                currentPage={currentPage}
                totalPages={totalPages}
                userId={userId}
            />
        </div>
        
    );
};

export default Description;