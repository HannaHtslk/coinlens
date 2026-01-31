import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4f8cff",
    },
    background: {
      default: "#0b0e14",
      paper: "#131722",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
});
