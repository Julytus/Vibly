import React, { useState } from 'react';
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

const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div> 
  )
}

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <h1>Error</h1>,

      children: [
        {index: true, element: <Feed />},
        {
          path: "contact",
          element: <Contact />,
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
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
