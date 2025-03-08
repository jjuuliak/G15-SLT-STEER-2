import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../pages/home/Home";
import LogIn from "../pages/LogIn";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import MealPlan from "../pages/mealPlan/MealPlan";
//import Profile from "../pages/Profile";
//import Chat from "../pages/Chat";
//import History from "../pages/History";
//import Settings from "../pages/Settings";
//import ForgotPassword from "../pages/ForgotPassword";

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated); // Check if user is logged in

  function ProtectedRoute() {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/meal-plan" element={<MealPlan />} />
        </Route>
        {/*<Route path="/data-input" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />*/}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
