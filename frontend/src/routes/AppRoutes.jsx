import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import RouteTracker from "./RouteTracker";
import Home from "../pages/home/Home";
import LogIn from "../pages/LogIn";
import ChatWindow from "../pages/ChatWindow";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import MealPlan from "../pages/mealPlan/MealPlan";
import WorkoutPlan from "../pages/workoutPlan";
import HamsterCollection from "../pages/HamsterCollection";

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated); // Check if user is logged in

  function ProtectedRoute() {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  }

  return (
    <>
      <RouteTracker />
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatWindow />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/workout-plan" element={<WorkoutPlan />} />
          <Route path="/hamster-collection" element={<HamsterCollection/>}/>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
