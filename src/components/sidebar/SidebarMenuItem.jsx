import React from 'react';
import { Link } from 'react-router-dom';

const SidebarMenuItem = ({ icon, text, path, isActive, hasSubMenu, children }) => {
  return (
    <li className={`nav-item ${isActive ? 'active' : ''}`}>
      {hasSubMenu ? (
        <>
          <a className={`nav-link ${isActive ? 'active' : ''} collapsed`} 
             data-bs-toggle="collapse" 
             href={`#${text.toLowerCase().replace(/\s+/g, '-')}`} 
             role="button" 
             aria-expanded="false">
            <i className="icon material-symbols-outlined">{icon}</i>
            <span className="item-name">{text}</span>
            <i className="right-icon material-symbols-outlined">chevron_right</i>
          </a>
          <ul className="sub-nav collapse" 
              id={text.toLowerCase().replace(/\s+/g, '-')} 
              data-bs-parent="#sidebar-menu">
            {children}
          </ul>
        </>
      ) : (
        <Link className={`nav-link ${isActive ? 'active' : ''}`} to={path}>
          <i className="icon material-symbols-outlined">{icon}</i>
          <span className="item-name">{text}</span>
        </Link>
      )}
    </li>
  );
};

export default SidebarMenuItem;
