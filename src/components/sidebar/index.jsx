import React from 'react';
import { useLocation } from 'react-router-dom';
import useSidebarToggle from '../../hooks/useSidebarToggle';
import SidebarLogo from './SidebarLogo';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarSubMenuItem from './SidebarSubMenuItem';

const Sidebar = () => {
  const location = useLocation();
  const { isMini, isOpen, toggleSidebarMode } = useSidebarToggle();

  return (
    <aside 
      className={`sidebar sidebar-default sidebar-base navs-rounded-all ${isMini ? 'sidebar-mini' : ''} ${!isOpen ? 'sidebar-close' : ''}`}
      id="first-tour" 
      data-toggle="main-sidebar" 
      data-sidebar="responsive"
    >
      <SidebarLogo isMini={isMini} toggleSidebarMode={toggleSidebarMode} />
      <div className="sidebar-body pt-0 data-scrollbar">
        <div className="sidebar-list">
          <ul className="navbar-nav iq-main-menu" id="sidebar-menu">
            {/* Main Section */}
            <li className="nav-item static-item">
              <a className="nav-link static-item disabled" href="#" tabIndex="-1">
                <span className="default-icon">Main</span>
                <span className="mini-icon">-</span>
              </a>
            </li>

            <SidebarMenuItem 
              icon="newspaper"
              text="Newsfeed"
              path="/"
              isActive={location.pathname === '/'}
            />

            <SidebarMenuItem
              icon="person"
              text="Profiles"
              hasSubMenu={true}
              isActive={location.pathname.includes('/profile')}
            >
              <SidebarSubMenuItem
                text="Profile"
                path="/profile"
                miniIcon="P"
                isActive={location.pathname === '/profile'}
              />
              {/* Add more profile sub items */}
            </SidebarMenuItem>

            {/* Friend Section */}
            <SidebarMenuItem
              icon="people"
              text="Friend"
              hasSubMenu={true}
              isActive={location.pathname.includes('/friend')}
            >
              <SidebarSubMenuItem
                text="Friend List"
                path="/friend-list"
                miniIcon="FL"
                isActive={location.pathname === '/friend-list'}
              />
              <SidebarSubMenuItem
                text="Friend Request"
                path="/friend-request"
                miniIcon="FR"
                isActive={location.pathname === '/friend-request'}
              />
            </SidebarMenuItem>

            {/* Add more menu items for Group, Notification, etc. */}
            <SidebarMenuItem
              icon="groups"
              text="Group"
              path="/group"
              isActive={location.pathname === '/group'}
            />

            <SidebarMenuItem
              icon="notifications"
              text="Notification"
              path="/notification"
              isActive={location.pathname === '/notification'}
            />

            {/* Featured Section */}
            <li>
              <hr className="hr-horizontal" />
            </li>
            <li className="nav-item static-item">
              <a className="nav-link static-item disabled" href="#" tabIndex="-1">
                <span className="default-icon">Featured</span>
                <span className="mini-icon">-</span>
              </a>
            </li>

            {/* Add Featured menu items */}
            <SidebarMenuItem
              icon="insert_drive_file"
              text="Files"
              path="/files"
              isActive={location.pathname === '/files'}
            />

            {/* Add more sections as needed */}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
