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
import { getProfileData } from "../../services/profileService";
import { getMealPlanData } from "../mealPlan/mealPlanFunctions";

const Home = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth?.access_token);
  const refreshToken = useSelector((state) => state.auth?.refresh_token);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    if (accessToken) {

      getMealPlanData(accessToken, refreshToken, dispatch, navigate);

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