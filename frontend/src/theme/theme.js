import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#05240E", // Dark green
      secondary: "#DAEDD7", // Light green
      light: "#F2F2F2" // Light grey
    },
    secondary: {
      main: "#CAE7F7", // Light blue
      secondary: "#D3D0FB", // Light purple
      dark: '#5245EF' // Accent purple
    },
  },
  typography: {
    fontFamily: "Poppins, Plus Jakarta Sans, Arial",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#05240E',
          '&:hover': {
            backgroundColor: '#2E604A',
          },
        },
      },
    },
  },
});

export default theme;
