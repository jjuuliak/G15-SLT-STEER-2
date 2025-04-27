import React from "react";
import { BrowserRouter } from "react-router-dom";
import './App.css';
import AppRoutes from "./routes/AppRoutes";
import AuthLoader from "./routes/AuthLoader";

function App() {
  return (
    <BrowserRouter>
      <AuthLoader>
        <AppRoutes />
      </AuthLoader>
    </BrowserRouter>
  );
}

export default App;
