import React, { useEffect, useState } from 'react';

const ColorCustomizer = () => {
  // State để lưu các màu hiện tại
  const [colors, setColors] = useState({
    primary: '#50b5ff',
    secondary: '#6c757d',
    success: '#2dcdb2',
    danger: '#ff9b8a',
    warning: '#ffba68',
    info: '#d592ff'
  });

  // Các theme có sẵn
  const themeColors = {
    'default': {
      primary: '#7093e5',
      secondary: '#f68685'
    },
    'color-1': {
      primary: '#4285F4',
      secondary: '#EA4335'
    },
    'color-2': {
      primary: '#FF4500',
      secondary: '#1A73E8'
    },
    'color-3': {
      primary: '#8755f2',
      secondary: '#EE4266'
    },
    'color-4': {
      primary: '#0A66C2',
      secondary: '#333333'
    },
    'color-5': {
      primary: '#00b75a',
      secondary: '#000000'
    }
  };

  // Load màu từ localStorage khi component mount
  useEffect(() => {
    const savedColors = localStorage.getItem('theme_colors');
    if (savedColors) {
      const parsedColors = JSON.parse(savedColors);
      setColors(prevColors => ({
        ...prevColors,
        ...parsedColors
      }));
      // Áp dụng màu đã lưu vào CSS
      Object.entries(parsedColors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--bs-${key}`, value);
      });
    }

    const savedTheme = localStorage.getItem('selected_theme');
    if (savedTheme) {
      const themeInput = document.querySelector(`input[value="${savedTheme}"]`);
      if (themeInput) {
        themeInput.checked = true;
      }
    }
  }, []);

  // Xử lý khi chọn theme có sẵn
  const handleThemeColor = (e) => {
    const target = e.target;
    const themeKey = target.value;
    const themeColorSet = themeColors[themeKey];

    if (themeColorSet) {
      // Cập nhật state và CSS variables
      setColors(prevColors => ({
        ...prevColors,
        ...themeColorSet
      }));

      // Áp dụng màu mới
      Object.entries(themeColorSet).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--bs-${key}`, value);
      });

      // Lưu vào localStorage
      localStorage.setItem('theme_colors', JSON.stringify({
        ...colors,
        ...themeColorSet
      }));
      localStorage.setItem('selected_theme', themeKey);
    }
  };

  // Xử lý khi thay đổi màu từ color picker
  const handleColorChange = (e) => {
    const target = e.target;
    const color = target.value;
    const colorType = target.getAttribute('data-extra');

    if (colorType) {
      // Cập nhật state
      setColors(prevColors => ({
        ...prevColors,
        [colorType]: color
      }));

      // Cập nhật CSS variable
      document.documentElement.style.setProperty(`--bs-${colorType}`, color);

      // Lưu vào localStorage
      localStorage.setItem('theme_colors', JSON.stringify({
        ...colors,
        [colorType]: color
      }));

      // Reset radio button selection
      const radioInputs = document.querySelectorAll('input[name="theme_color"]');
      radioInputs.forEach(input => {
        input.checked = false;
      });
      localStorage.removeItem('selected_theme');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h6 className="mt-4 mb-3">Color Customizer</h6>
        <div className="d-flex align-items-center">
          <a href="#custom-color" data-bs-toggle="collapse" role="button" aria-expanded="true" aria-controls="custom-color">Custom</a>
          <div data-setting="radio">
            <input 
              type="radio" 
              value="default" 
              className="btn-check" 
              name="theme_color" 
              id="default" 
              onChange={handleThemeColor}
            />
            <label className="btn bg-transparent px-2 border-0" htmlFor="default" data-bs-toggle="tooltip" data-bs-placement="top" title="Reset Color">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.4799 12.2424C21.7557 12.2326 21.9886 12.4482 21.9852 12.7241C21.9595 14.8075 21.2975 16.8392 20.0799 18.5506C18.7652 20.3986 16.8748 21.7718 14.6964 22.4612C12.518 23.1505 10.1711 23.1183 8.01299 22.3694C5.85488 21.6205 4.00382 20.196 2.74167 18.3126C1.47952 16.4293 0.875433 14.1905 1.02139 11.937C1.16734 9.68346 2.05534 7.53876 3.55018 5.82945C5.04501 4.12014 7.06478 2.93987 9.30193 2.46835C11.5391 1.99683 13.8711 2.2599 15.9428 3.2175L16.7558 1.91838C16.9822 1.55679 17.5282 1.62643 17.6565 2.03324L18.8635 5.85986C18.945 6.11851 18.8055 6.39505 18.549 6.48314L14.6564 7.82007C14.2314 7.96603 13.8445 7.52091 14.0483 7.12042L14.6828 5.87345C13.1977 5.18699 11.526 4.9984 9.92231 5.33642C8.31859 5.67443 6.8707 6.52052 5.79911 7.74586C4.72753 8.97119 4.09095 10.5086 3.98633 12.1241C3.8817 13.7395 4.31474 15.3445 5.21953 16.6945C6.12431 18.0446 7.45126 19.0658 8.99832 19.6027C10.5454 20.1395 12.2278 20.1626 13.7894 19.6684C15.351 19.1743 16.7062 18.1899 17.6486 16.8652C18.4937 15.6773 18.9654 14.2742 19.0113 12.8307C19.0201 12.5545 19.2341 12.3223 19.5103 12.3125L21.4799 12.2424Z" fill="#31BAF1"/>
                <path d="M20.0941 18.5594C21.3117 16.848 21.9736 14.8163 21.9993 12.7329C22.0027 12.4569 21.7699 12.2413 21.4941 12.2512L19.5244 12.3213C19.2482 12.3311 19.0342 12.5633 19.0254 12.8395C18.9796 14.283 18.5078 15.6861 17.6628 16.8739C16.7203 18.1986 15.3651 19.183 13.8035 19.6772C12.2419 20.1714 10.5595 20.1483 9.01246 19.6114C7.4654 19.0746 6.13845 18.0534 5.23367 16.7033C4.66562 15.8557 4.28352 14.9076 4.10367 13.9196C4.00935 18.0934 6.49194 21.37 10.008 22.6416C10.697 22.8908 11.4336 22.9852 12.1652 22.9465C13.075 22.8983 13.8508 22.742 14.7105 22.4699C16.8889 21.7805 18.7794 20.4073 20.0941 18.5594Z" fill="#0169CA"/>
              </svg>
            </label>
          </div>
        </div>
      </div>

      <div className="collapse show" id="custom-color">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="form-group d-flex justify-content-between align-items-center">
            <label className="" htmlFor={`custom-${key}-color`}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input 
              className=""
              name="theme_color"
              data-extra={key}
              type="color"
              id={`custom-${key}-color`}
              value={value}
              onChange={handleColorChange}
              data-setting="color"
            />
          </div>
        ))}
      </div>

      <div className="grid-cols-5 mb-4 d-grid gap-3">
        {Object.entries(themeColors).filter(([key]) => key !== 'default').map(([key, colors]) => (
          <div key={key} data-setting="radio">
            <input 
              type="radio" 
              value={key} 
              className="btn-check" 
              name="theme_color" 
              id={`theme-${key}`}
              onChange={handleThemeColor}
            />
            <label 
              className="btn btn-border d-block bg-transparent" 
              htmlFor={`theme-${key}`} 
              data-bs-toggle="tooltip" 
              data-bs-placement="top" 
              title={`Theme-${key.split('-')[1]}`}
            >
              <svg className="customizer-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26">
                <circle cx="12" cy="12" r="10" fill={colors.primary}/>
                <path d="M2,12 a1,1 1 1,0 20,0" fill={colors.secondary}/>
              </svg>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorCustomizer; 