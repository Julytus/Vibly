import React from 'react';

const FriendRequests = () => {
  return (
    <li className="nav-item dropdown">
      <a href="#" className="dropdown-toggle d-flex align-items-center" id="group-drop" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span className="material-symbols-outlined">group</span>
      </a>
      <div className="sub-drop sub-drop-large dropdown-menu" aria-labelledby="group-drop">
        <div className="card shadow m-0">
          <div className="card-header d-flex justify-content-between px-0 pb-4 mx-5 border-bottom">
            <div className="header-title">
              <h5 className="fw-semibold">Friend Request</h5>
            </div>
          </div>
          <div className="card-body">
            {/* Friend request content */}
          </div>
        </div>
      </div>
    </li>
  );
};

export default FriendRequests;
