import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material/styles";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#4f8cff",
      },
      background:
        mode === "dark"
          ? {
            default: "#0b0e14",
            paper: "#131722",
          }
          : {
            default: "#f5f7fa",
            paper: "#ffffff",
          },
      text:
        mode === "dark"
          ? {
            primary: "rgba(255, 255, 255, 0.87)",
            secondary: "rgba(255, 255, 255, 0.6)",
          }
          : {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.6)",
          },
    },
    typography: {
      fontFamily: "Inter, Roboto, sans-serif",
    },
  });
