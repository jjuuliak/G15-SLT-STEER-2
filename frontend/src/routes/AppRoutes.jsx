import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
//import Profile from "../pages/Profile";
//import Chat from "../pages/Chat";
//import History from "../pages/History";
//import Settings from "../pages/Settings";
//import ForgotPassword from "../pages/ForgotPassword";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        {/*<Route path="/data-input" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />*/}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
