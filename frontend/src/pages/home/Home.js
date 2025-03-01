import React from "react";
import { Container } from "@mui/material";
import Chat from "../../components/Chat";
import TopBar from "../../components/TopBar";

const Home = () => {
    return (
        <Container
          id='view-container'
          maxWidth={false}
          sx={{ height: "100vh", width: "100vw", padding: 0,  }}>
          <TopBar />
          <Chat/>
        </Container>
      );
};

export default Home;