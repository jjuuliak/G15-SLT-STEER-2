import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
//import Profile from "../pages/Profile";
//import Chat from "../pages/Chat";
//import History from "../pages/History";
//import Settings from "../pages/Settings";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path="/data-input" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />*/}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
