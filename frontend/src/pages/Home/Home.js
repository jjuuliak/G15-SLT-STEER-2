import React from "react";
import { Typography, Container } from "@mui/material";

const Home = () => {
    return (
        <Container>
          <Typography variant="h4" gutterBottom>
            Heart Disease MVP
          </Typography>
          <Typography variant="body1">
            Welcome to the heart disease patient lifestyle guidance application.
          </Typography>
        </Container>
      );
};

export default Home;