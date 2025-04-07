import React from "react";
import { Container, Grid2 as Grid } from "@mui/material";
import TopBar from "../../components/TopBar";
import MealPlanBox from "../../components/dashboard/MealPlanBox";
import Vitals from "../../components/dashboard/Vitals";
import WeightChart from "../../components/dashboard/WeightChart";
import Exercise from "../../components/dashboard/Exercise";
import HamsterChat from "../../components/dashboard/HamsterChat";
import HamsterFamily from "../../components/dashboard/HamsterFamily";
import './Home.css';

const Home = () => {

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