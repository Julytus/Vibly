import React from 'react';

const Messages = () => {
  return (
    <li className="nav-item dropdown">
      <a href="#" className="dropdown-toggle d-flex align-items-center" id="mail-drop" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i className="material-symbols-outlined">mail</i>
        <span className="mobile-text d-none ms-3">Message</span>
      </a>
      <div className="sub-drop dropdown-menu header-notification" aria-labelledby="mail-drop">
        {/* Messages content */}
      </div>
    </li>
  );
};

export default Messages;
