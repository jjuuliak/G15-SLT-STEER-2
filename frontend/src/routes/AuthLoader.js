import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router';
import { LOGIN_SUCCESS } from "../redux/actionTypes";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const userParsed = user && user !== "undefined" ? JSON.parse(user) : null;

    if (token && userParsed) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          access_token: token,
          user_data: userParsed,
        },
      });

      const lastVisited = localStorage.getItem("link");
      if (lastVisited && window.location.pathname === "/") {
        navigate(lastVisited, { replace: true });
        localStorage.removeItem("link");
      }
    }

    setLoaded(true);
  }, [dispatch, navigate]);

  // Show a loading screen until Redux is updated
  if (!loaded) return <div>Loading...</div>;

  return children;
};

export default AuthLoader;
