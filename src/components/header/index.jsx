import React from 'react';
import logo from '../../public/images/logo.png';
import logoLight from '../../public/images/logo-light.png';
import logoMobile from '../../public/images/logo-mobile.png';
import logoMobileLight from '../../public/images/logo-mobile-light.png';
import avatar from '../../public/images/avatars/avatar-2.jpg';
import { callLogout } from '../../services/api';

const Header = () => {
  const handleLogout = async () => {
    try {
      const response = await callLogout();
      console.log(response.data);
      // Handle successful logout (e.g., clear token, redirect)
      localStorage.removeItem('token');
      window.location.href = '/#'; // Redirect to the login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  return (
    <header className="z-[100] h-[--m-top] fixed top-0 left-0 w-full flex items-center bg-white/80 sky-50 backdrop-blur-xl border-b border-slate-200 dark:bg-dark2 dark:border-slate-800">
      <div className="flex items-center w-full xl:px-6 px-2 max-lg:gap-10">
        <div className="2xl:w-[--w-side] lg:w-[--w-side-sm]">
          {/* left */}
          <div className="flex items-center gap-1">
            {/* icon menu */}
            <button uk-toggle="target: #site__sidebar ; cls :!-translate-x-0"
              className="flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-gray-100 xl:hidden dark:hover:bg-slate-600 group">
              <ion-icon name="menu-outline" className="text-2xl group-aria-expanded:hidden"></ion-icon>
              <ion-icon name="close-outline" className="hidden text-2xl group-aria-expanded:block"></ion-icon>
            </button>
            <div id="logo">
              <a href="feed.html">
                <img src={logo} alt="" className="w-28 md:block hidden dark:!hidden" />
                <img src={logoLight} alt="" className="dark:md:block hidden" />
                <img src={logoMobile} className="hidden max-md:block w-20 dark:!hidden" alt="" />
                <img src={logoMobileLight} className="hidden dark:max-md:block w-20" alt="" />

              </a>

            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="max-w-[1220px] mx-auto flex items-center">
            {/* search */}
            <div id="search--box" className="xl:w-[680px] sm:w-96 sm:relative rounded-xl overflow-hidden z-20 bg-secondery max-md:hidden w-screen left-0 max-sm:fixed max-sm:top-2 dark:!bg-white/5">
              <ion-icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2"></ion-icon>
              <input type="text" placeholder="Search Friends, videos .." className="w-full !pl-10 !font-normal !bg-transparent h-12 !text-sm" />
            </div>
            {/* search dropdown*/}
            {/* ... (phần còn lại của search dropdown) ... */}

            {/* header icons */}
            <div className="flex items-center sm:gap-4 gap-2 absolute right-5 top-1/2 -translate-y-1/2 text-black">
              {/* create */}
              <button type="button" className="sm:p-2 p-1 rounded-full relative sm:bg-secondery dark:text-white" aria-haspopup="true" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 max-sm:hidden">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <ion-icon name="add-circle-outline" className="sm:hidden text-2xl"></ion-icon>
              </button>
              {/* ... (phần còn lại của create dropdown) ... */}

              {/* notification */}
              <button type="button" className="sm:p-2 p-1 rounded-full relative sm:bg-secondery dark:text-white" uk-tooltip="title: Notification; pos: bottom; offset:6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 max-sm:hidden">
                  <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
                  <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z" clipRule="evenodd" />
                </svg>
                <div className="absolute top-0 right-0 -m-1 bg-red-600 text-white text-xs px-1 rounded-full">6</div>
                <ion-icon name="notifications-outline" className="sm:hidden text-2xl"></ion-icon>
              </button>
              {/* ... (phần còn lại của notification dropdown) ... */}

              {/* messages */}
              <button type="button" className="sm:p-2 p-1 rounded-full relative sm:bg-secondery dark:text-white" uk-tooltip="title: Messages; pos: bottom; offset:6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 max-sm:hidden">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                </svg>
                <ion-icon name="chatbox-ellipses-outline" className="sm:hidden text-2xl"></ion-icon>
              </button>
              {/* ... (phần còn lại của messages dropdown) ... */}

              {/* profile */}
              <div className="rounded-full relative bg-secondery cursor-pointer shrink-0" tabIndex="0" aria-haspopup="true" aria-expanded="false">
                <img src={avatar} alt="" className="sm:w-9 sm:h-9 w-7 h-7 rounded-full shadow shrink-0" />

                {/* profile dropdown */}
                <div className="hidden bg-white rounded-lg drop-shadow-xl dark:bg-slate-700 w-64 border2"
                  uk-drop="offset:6;pos: bottom-right;animate-out: true; animation: uk-animation-scale-up uk-transform-origin-top-right ">

                  <a href="timeline.html">
                    <div className="p-4 py-5 flex items-center gap-4">
                      <img src={avatar} alt="" className="w-10 h-10 rounded-full shadow" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-black">Stell johnson</h4>
                        <div className="text-sm mt-1 text-blue-600 font-light dark:text-white/70">@mohns
                        on</div>
                      </div>
                    </div>
                  </a>

                  <hr className="dark:border-gray-600/60" />

                  <nav className="p-2 text-sm text-black font-normal dark:text-white">
                    <a href="upgrade.html">
                      <div className="flex items-center gap-2.5 hover:bg-secondery p-2 px-2.5 rounded-md dark:hover:bg-white/10 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                        Upgrade To Premium
                      </div>
                    </a>
                    <a href="setting.html">
                      <div className="flex items-center gap-2.5 hover:bg-secondery p-2 px-2.5 rounded-md dark:hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        My Account
                      </div>
                    </a>
                    {/* ... (các mục menu khác tương tự) */}
                    
                    <button type="button" className="w-full">
                      <div className="flex items-center gap-2.5 hover:bg-secondery p-2 px-2.5 rounded-md dark:hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                        </svg>
                        Night mode
                        <span className="bg-slate-200/40 ml-auto p-0.5 rounded-full w-9 dark:hover:bg-white/20">
                          <span className="bg-white block h-4 relative rounded-full shadow-md w-2 w-4 dark:bg-blue-600"></span>
                        </span>
                      </div>
                    </button>
                    <hr className="-mx-2 my-2 dark:border-gray-600/60" />
                    <button type="button" className="w-full" onClick={handleLogout}>
                      <div className="flex items-center gap-2.5 hover:bg-secondery p-2 px-2.5 rounded-md dark:hover:bg-white/10">
                        <svg className="w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Log Out
                      </div>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;