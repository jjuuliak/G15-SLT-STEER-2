import React from "react";
import { Box } from "@mui/material";

const Logo = () => {
  return (
    <Box // solita logo
      sx={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '50px',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="80"
        viewBox="0 0 64 80"
        fill="none"
      >
        <rect y="40" width="20" height="40" fill="white" />
        <rect x="44" width="20" height="40" fill="white" />
        <rect x="22" width="20" height="80" fill="white" />
      </svg>
    </Box>
  );
}

export default Logo;