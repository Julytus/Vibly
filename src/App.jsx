import React, { useEffect, useState, useCallback } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/login";
import Contact from "./pages/contact";
import Header from "./components/header";
import Footer from "./components/footer";
import { Outlet } from "react-router-dom";
import Feed from "./pages/feed";
import Register from "./pages/register";
import { fetchProfile } from "./services/api";
import { useDispatch } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './components/loading';
import { useSelector } from 'react-redux';
import Error404 from './components/error404';
import Admin from './pages/admin';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/sidebar';
import SettingPanel from './components/SettingPanel';
import ProfilePage from './pages/profile';
import MiniChatBox from './components/minichatbox';
import Chat from './pages/chat';
import { useWebSocket } from './hooks/useWebSocket';
import Toast from './components/Toast';
const Layout = () => {
  return (
    <div className="layout-app">
      <Sidebar />
      <main className="main-content">
        <Header />
        <Outlet />
        <Footer />
        <SettingPanel />
        <MiniChatBox />
      </main>
    </div> 
  )
}

const LayoutAdmin = () => {
  const userRole = useSelector(state => state.account.userProfile.role);
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  return (
    <div className="layout-app">
      {userRole === "ROLE_ADMIN" && isAdminRoute && <Header />}
      <Outlet />
      {userRole === "ROLE_ADMIN" && isAdminRoute && <Footer />}
    </div> 
  )
}
export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading);
  const userProfile = useSelector(state => state.account.userProfile);

  // Sử dụng custom hook để quản lý WebSocket
  useWebSocket(userProfile);

  const getProfile = async () => {
    if (window.location.pathname === "/login" ||
      window.location.pathname === "/register") {
      return;
    }
    const response = await fetchProfile();
    if (response) {
      dispatch(doGetAccountAction(response));
    } else {
      dispatch(doLogoutAction());
    }
  }

  useEffect(() => {
    const fetchProfileInfo = async () => {
      await getProfile();
    }
    fetchProfileInfo();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <Error404 />,
      children: [
        {index: true, element: 
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        },
      ]
    },
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error404 />,

      children: [
        {index: true, element: <Feed />},
        {
          path: "profile/:id",
          element: <ProfilePage />,
        }
      ]
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "chat",
      element: <Chat />,
    },
    {
      path: "chat/:activeConversationId",
      element: <Chat />,
    },
  ]);

  return (
    <>
      {!isLoading || 
        window.location.pathname === "/login" ||
        window.location.pathname === "/register" ? 
        <RouterProvider router={router} /> : <Loading />}
      <Toast />
    </>
  )
}
