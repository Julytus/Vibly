import React, { useState, useEffect } from 'react';

const ThemeSettings = () => {
  const [theme, setTheme] = useState('light');

  // Hàm kiểm tra theme hệ thống
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Hàm cập nhật theme
  const applyTheme = (selectedTheme) => {
    const themeToApply = selectedTheme === 'auto' ? getSystemTheme() : selectedTheme;
    document.documentElement.setAttribute('data-bs-theme', themeToApply);
  };

  useEffect(() => {
    // Lấy theme từ localStorage khi component mount
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Thêm listener cho thay đổi theme hệ thống
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup listener
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]); // Thêm theme vào dependencies

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    applyTheme(selectedTheme);
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">Theme</h5>
      
      {/* Light Theme Option */}
      <div className="mb-3" data-setting="radio">
        <div className="form-check mb-0 w-100">
          <input 
            className="form-check-input custum-redio-btn" 
            type="radio" 
            value="light" 
            name="theme_scheme" 
            id="color-mode-light"
            checked={theme === 'light'}
            onChange={() => handleThemeChange('light')}
          />
          <label className="form-check-label h6 d-flex align-items-center justify-content-between" htmlFor="color-mode-light">
            <span>Light Theme</span>
            <div className="text-primary">
              <svg width="60" height="27" viewBox="0 0 60 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.375" y="0.375" width="59.25" height="26.25" rx="4.125" fill="white"/>
                <circle cx="9.75" cy="9.75" r="3.75" fill="#80868B"/>
                <rect x="16.5" y="8.25" width="37.5" height="3" rx="1.5" fill="#DADCE0"/>
                <rect x="6" y="18" width="48" height="3" rx="1.5" fill="currentColor"/>
                <rect x="0.375" y="0.375" width="59.25" height="26.25" rx="4.125" stroke="#DADCE0" strokeWidth="0.75"/>
              </svg>
            </div>
          </label>
        </div>
      </div>

      {/* Dark Theme Option */}
      <div className="mb-3" data-setting="radio">
        <div className="form-check mb-0 w-100">
          <input 
            className="form-check-input custum-redio-btn" 
            type="radio" 
            value="dark" 
            name="theme_scheme" 
            id="color-mode-dark"
            checked={theme === 'dark'}
            onChange={() => handleThemeChange('dark')}
          />
          <label className="form-check-label h6 d-flex align-items-center justify-content-between" htmlFor="color-mode-dark">
            <span>Dark Theme</span>
            <div className="text-primary">
              <svg width="60" height="27" viewBox="0 0 60 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.375" y="0.375" width="59.25" height="26.25" rx="4.125" fill="#1E2745"/>
                <circle cx="9.75" cy="9.75" r="3.75" fill="#80868B"/>
                <rect x="16.5" y="8.25" width="37.5" height="3" rx="1.5" fill="#DADCE0"/>
                <rect x="6" y="18" width="48" height="3" rx="1.5" fill="currentColor"/>
                <rect x="0.375" y="0.375" width="59.25" height="26.25" rx="4.125" stroke="currentColor" strokeWidth="0.75"/>
              </svg>
            </div>
          </label>
        </div>
      </div>

      {/* Auto Theme Option */}
      <div className="d-flex align-items-center justify-content-between" data-setting="radio">
        <div className="form-check mb-0 w-100">
          <input 
            className="form-check-input custum-redio-btn" 
            type="radio" 
            value="auto" 
            name="theme_scheme" 
            id="color-mode-auto"
            checked={theme === 'auto'}
            onChange={() => handleThemeChange('auto')}
          />
          <label className="form-check-label h6 d-flex align-items-center justify-content-between" htmlFor="color-mode-auto">
            <span>Device Default</span>
            <div className="text-primary">
              <svg className="rounded" width="60" height="27" viewBox="0 0 60 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.375" y="0.375" width="59.25" height="26.25" rx="4.125" fill="#1E2745"/>
                <circle cx="9.75" cy="9.75" r="3.75" fill="#80868B"/>
                <rect x="16.5" y="8.25" width="37.5" height="3" rx="1.5" fill="#DADCE0"/>
                <rect x="6" y="18" width="48" height="3" rx="1.5" fill="currentColor"/>
                <g clipPath="url(#clip0_507_92)">
                  <rect width="30" height="27" fill="white"/>
                  <circle cx="9.75" cy="9.75" r="3.75" fill="#80868B"/>
                  <rect x="16.5" y="8.25" width="37.5" height="3" rx="1.5" fill="#DADCE0"/>
                  <rect x="6" y="18" width="48" height="3" rx="1.5" fill="currentColor"/>
                </g>
                <rect x="0.375" y="0.375" width="59.25" height="26.25" rx="4.125" stroke="#DADCE0" strokeWidth="0.75"/>
                <defs>
                  <clipPath id="clip0_507_92">
                    <rect width="30" height="27" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
