import React from "react";
import { Container } from "@mui/material";
import Chat from "../../components/Chat";
import TopBar from "../../components/TopBar";

const Home = () => {
    return (
        <Container>
          <TopBar />
          <Chat/>
        </Container>
      );
};

export default Home;