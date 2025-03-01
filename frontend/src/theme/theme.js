import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E3E30",
      secondary: "#EAF2E1",
    },
    secondary: {
      main: "#2E604A",
      secondary: "#198754"
    },
  },
  typography: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  },
});

export default theme;
