import React from 'react';

const Notifications = () => {
  return (
    <li className="nav-item dropdown">
      <a href="#" className="search-toggle dropdown-toggle d-flex align-items-center" id="notification-drop" data-bs-toggle="dropdown" aria-expanded="false">
        <span className="material-symbols-outlined position-relative">notifications
          <span className="bg-primary text-white notification-badge"></span>
        </span>
      </a>
      <div className="sub-drop dropdown-menu header-notification" aria-labelledby="notification-drop">
        {/* Notifications content */}
      </div>
    </li>
  );
};

export default Notifications;
