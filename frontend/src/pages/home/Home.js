import React, { useEffect } from "react";
import { Container, Grid2 as Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
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

const Home = () => {

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth?.access_token);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    if (accessToken) {
      fetch("http://localhost:8000/last-meal-plan", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
      })
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
        getProfileData(accessToken, dispatch);
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