import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { callLogout } from '../../services/api';
import { useDispatch } from 'react-redux';

const UserDropdown = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
        await callLogout();
        dispatch(doLogoutAction());
        localStorage.removeItem('token');
        navigate('/login');
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };

  return (
    <li className="nav-item dropdown user-dropdown">
      <a href="#" className="d-flex align-items-center dropdown-toggle" id="drop-down-arrow" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <img src={user?.avatar} className="img-fluid rounded-circle avatar-48 border border-2 me-3" alt="user" loading="lazy" />
      </a>
      <div className="sub-drop dropdown-menu caption-menu" aria-labelledby="drop-down-arrow">
        <div className="card shadow-none m-0">
          <div className="card-header">
            <div className="header-title">
              <h5 className="mb-0">Hello {user?.first_name + ' ' + user?.last_name || 'User'}</h5>
            </div>
          </div>
          <div className="card-body p-0">
            <Link to={`/profile/${user?.id}`} className="d-flex align-items-center iq-sub-card border-0">
              <span className="material-symbols-outlined">line_style</span>
              <div className="ms-3">
                <h6 className="mb-0 h6">My Profile</h6>
              </div>
            </Link>
            <Link to="/profile-edit" className="d-flex align-items-center iq-sub-card border-0">
              <span className="material-symbols-outlined">edit_note</span>
              <div className="ms-3">
                <h6 className="mb-0 h6">Edit Profile</h6>
              </div>
            </Link>
            <Link to="/account-setting" className="d-flex align-items-center iq-sub-card border-0">
              <span className="material-symbols-outlined">manage_accounts</span>
              <div className="ms-3">
                <h6 className="mb-0 h6">Account settings</h6>
              </div>
            </Link>
            <Link to="/privacy-setting" className="d-flex align-items-center iq-sub-card border-0">
              <span className="material-symbols-outlined">lock</span>
              <div className="ms-3">
                <h6 className="mb-0 h6">Privacy Settings</h6>
              </div>
            </Link>
            <a href="#" className="d-flex align-items-center iq-sub-card" onClick={handleLogout}>
              <span className="material-symbols-outlined">login</span>
              <div className="ms-3">
                <h6 className="mb-0 h6">Sign out</h6>
              </div>
            </a>
            
            {/* Chat Settings Section */}
            <div className="iq-sub-card">
              <h5>Chat Settings</h5>
            </div>
            <div className="d-flex align-items-center iq-sub-card border-0">
              <i className="material-symbols-outlined text-success md-14">circle</i>
              <div className="ms-3">Online</div>
            </div>
            <div className="d-flex align-items-center iq-sub-card border-0">
              <i className="material-symbols-outlined text-warning md-14">circle</i>
              <div className="ms-3">Away</div>
            </div>
            <div className="d-flex align-items-center iq-sub-card border-0">
              <i className="material-symbols-outlined text-danger md-14">circle</i>
              <div className="ms-3">Disconnected</div>
            </div>
            <div className="d-flex align-items-center iq-sub-card border-0">
              <i className="material-symbols-outlined text-gray md-14">circle</i>
              <div className="ms-3">Invisible</div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default UserDropdown;
