import React from 'react';
import ThemeSettings from './ThemeSettings';
// import MenuStyleSettings from './MenuStyleSettings';
// import ActiveMenuSettings from './ActiveMenuSettings';
import ColorCustomizer from './ColorCustomizer';
// import DirectionSettings from './DirectionSettings';

const SettingPanel = () => {
  return (
    <>
      <div 
        className="offcanvas offcanvas-end live-customizer on-rtl end" 
        tabIndex="-1" 
        id="live-customizer" 
        data-bs-backdrop="false" 
        data-bs-scroll="true" 
        aria-labelledby="live-customizer-label"
      >
        <div className="offcanvas-header pb-0">
          <div className="d-flex align-items-center">
            <h4 className="offcanvas-title" id="live-customizer-label">Setting Panel</h4>
          </div>
          <div className="close-icon" data-bs-dismiss="offcanvas">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="offcanvas-body data-scrollbar">
          <div className="row">
            <div className="col-lg-12">
              <div>
                <div className="text-center mb-4">
                  <h5 className="d-inline-block">Style Setting</h5>
                </div>
                
                <ThemeSettings />
                <hr className="hr-horizontal" />
                
                {/* <MenuStyleSettings />
                <hr className="hr-horizontal" />
                
                <ActiveMenuSettings />
                <hr className="hr-horizontal" /> */}
                
                <ColorCustomizer />
                <hr className="hr-horizontal" />
                
                {/* <DirectionSettings /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <a 
        className="btn btn-fixed-end btn-danger btn-icon btn-setting" 
        id="settingbutton"
        data-bs-toggle="offcanvas" 
        data-bs-target="#live-customizer" 
        role="button" 
        aria-controls="live-customizer"
      >
        <span className="icon material-symbols-outlined animated-rotate text-white">
          settings
        </span>
      </a>
    </>
  );
};

export default SettingPanel;
