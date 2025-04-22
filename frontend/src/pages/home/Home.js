import React, { useEffect } from "react";
import { Container, Grid2 as Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router';
import TopBar from "../../components/TopBar";
import MealPlanBox from "../../components/dashboard/MealPlanBox";
import Vitals from "../../components/dashboard/Vitals";
import WeightChart from "../../components/dashboard/WeightChart";
import Exercise from "../../components/dashboard/Exercise";
import HamsterChat from "../../components/dashboard/HamsterChat";
import HamsterFamily from "../../components/dashboard/HamsterFamily";
import './Home.css';
import { setMealPlan } from '../../redux/actionCreators/mealPlanActions';
import { getProfileData } from "../../services/profileService";
import { fetchWithAuth } from '../../services/authService';

const Home = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth?.access_token);
  const refreshToken = useSelector((state) => state.auth?.refresh_token);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    if (accessToken) {
      fetchWithAuth("http://localhost:8000/last-meal-plan", {
        method: "POST",
        headers: null, // Default set in fetchWithAuth
      }, accessToken, refreshToken, dispatch, navigate)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch meal plan data");
          }
          return response.json();
        })
        .then((data) => {
          dispatch(setMealPlan(data));
        })
        .catch((error) => {
          console.error("Error fetching meal plans:", error);
        });

      if (!user || user === 'undefined') {
        getProfileData(accessToken, refreshToken, dispatch, navigate);
      }
    }
  }, []);

  return (
    <Container
      id='view-container'
      maxWidth={false}
      sx={{ height: "100vh", width: "100vw", padding: 0 }}>
      <TopBar />
      <Grid className="dashboard">
        <MealPlanBox />
        <Vitals />
        <WeightChart />
        <HamsterChat />
        <Exercise />
        <HamsterFamily />
      </Grid>
    </Container>
  );
};

export default Home;