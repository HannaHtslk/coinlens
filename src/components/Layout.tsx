import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeMode } from "../context/ThemeContext";

const Layout = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 10,
        mb: 4,
        borderRadius: 0,
        borderBottom: "1px solid",
        borderColor: "divider",
        background:
          mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))"
            : "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0))",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, md: 72 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          component={NavLink}
          to="/dashboard"
          sx={{
            mr: "auto",
            fontSize: { xs: "0.9rem", md: "1rem" },
            fontWeight: 700,
            color: "text.primary",
            textDecoration: "none",

            "&:hover": {
              opacity: 0.85,
            },
          }}
        >
          Coin<span style={{ fontWeight: 400 }}>Lens</span>
        </Typography>

        <Box sx={{ display: "flex", gap: { xs: 0.5, md: 1 }, alignItems: "center" }}>
          {[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Portfolio", to: "/portfolio" },
          ].map(({ label, to }) => (
            <Button
              key={to}
              component={NavLink}
              to={to}
              sx={{
                color: "text.primary",
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 0.8, md: 1.2 },
                borderRadius: 2,
                fontWeight: 500,
                textTransform: "none",
                fontSize: { xs: "0.875rem", md: "1rem" },

                "&.active": {
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(0,0,0,0.08)",
                },

                "&:hover": {
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)",
                },
              }}
            >
              {label}
            </Button>
          ))}

          <IconButton
            onClick={toggleTheme}
            sx={{
              ml: 1,
              color: "text.primary",
              "&:hover": {
                backgroundColor:
                  mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.04)",
              },
            }}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Layout;
