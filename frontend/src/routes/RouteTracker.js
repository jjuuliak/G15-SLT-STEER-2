import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const RouteTracker = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && location.pathname !== "/login" && location.pathname !== "/register") {
      localStorage.setItem("link", location.pathname);
    }
  }, [location, isAuthenticated]);

  return null;
};

export default RouteTracker;
