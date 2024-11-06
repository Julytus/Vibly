import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setInitialState } from '../redux/slices/sidebarSlice';

const getInitialSidebarState = (pathname) => {
  // Define default states for different routes
  const routeStates = {
    '/': { leftSidebarOpen: true, rightSidebarOpen: true },
    '/profile': { leftSidebarOpen: true, rightSidebarOpen: false },
    // Add more routes as needed
  };

  return routeStates[pathname] || { leftSidebarOpen: true, rightSidebarOpen: true };
};

const useSidebarState = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { leftSidebarOpen, rightSidebarOpen } = useSelector((state) => state.sidebar);

  useEffect(() => {
    const initialState = getInitialSidebarState(location.pathname);
    dispatch(setInitialState(initialState));
  }, [location.pathname, dispatch]);

  // Calculate body class based on sidebar states
  const getBodyClass = () => {
    if (!leftSidebarOpen && !rightSidebarOpen) {
      return 'sidebar-main right-sidebar-close';
    } else if (!leftSidebarOpen) {
      return 'right-sidebar-close';
    } else if (!rightSidebarOpen) {
      return 'sidebar-main';
    }
    return '';
  };

  useEffect(() => {
    // Save to localStorage whenever state changes
    localStorage.setItem('sidebarState', JSON.stringify({
      leftSidebarOpen,
      rightSidebarOpen
    }));
  }, [leftSidebarOpen, rightSidebarOpen]);

  // On initial load, check localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState) {
      dispatch(setInitialState(JSON.parse(savedState)));
    } else {
      const initialState = getInitialSidebarState(location.pathname);
      dispatch(setInitialState(initialState));
    }
  }, []);

  return {
    bodyClass: getBodyClass(),
    leftSidebarOpen,
    rightSidebarOpen
  };
};

export default useSidebarState; 