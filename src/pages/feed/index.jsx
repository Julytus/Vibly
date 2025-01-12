import PostCreation from '../profile/PostCreation';
import PostTimeline from './PostTimeline';
import React, { useState } from 'react';

const Feed = () => {

  const [newPost, setNewPost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);

  return (
    <div className='container-inner' id='page_layout'>
      <div className='container'>
        <div className='row gx-4'>
          <div className='col-lg-8' id='dynamicDivContainer'>
            <div className='content'>
              <div className='col-sm-12'>
                <PostCreation
                  setNewPost={setNewPost}
                  setPostLoading={setPostLoading}
                />
                <PostTimeline
                  newPost={newPost}
                  postLoading={postLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed;