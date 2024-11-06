import { useState, useEffect } from 'react';

const useSidebarToggle = () => {
  const [isMini, setIsMini] = useState(() => {
    const saved = localStorage.getItem('sidebarMini');
    return saved ? JSON.parse(saved) : false;
  });

  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarMini', JSON.stringify(isMini));
  }, [isMini]);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleSidebarMode = () => {
    setIsMini(!isMini);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return { isMini, isOpen, toggleSidebarMode, toggleSidebar };
};

export default useSidebarToggle;
