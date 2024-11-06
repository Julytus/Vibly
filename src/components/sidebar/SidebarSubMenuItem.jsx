import React from 'react';
import { Link } from 'react-router-dom';

const SidebarSubMenuItem = ({ text, path, miniIcon, isActive }) => {
  return (
    <li className="nav-item">
      <Link className={`nav-link ${isActive ? 'active' : ''}`} to={path}>
        <i className="icon material-symbols-outlined filled">fiber_manual_record</i>
        <i className="sidenav-mini-icon">{miniIcon}</i>
        <span className="item-name">{text}</span>
      </Link>
    </li>
  );
};

export default SidebarSubMenuItem;
