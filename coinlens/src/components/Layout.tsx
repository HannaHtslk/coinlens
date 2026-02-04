import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";

const Layout = () => {
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
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: 4 }}>
        <Typography
          component={NavLink}
          to="/dashboard"
          sx={{
            mr: "auto",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#e5e7eb",
            textDecoration: "none",

            "&:hover": {
              opacity: 0.85,
              color: "#e5e7eb",
            },
            "&:visited": {
              color: "#e5e7eb",
            },
          }}
        >
          Coin<span style={{ fontWeight: 400 }}>Lens</span>
        </Typography>


        <Box sx={{ display: "flex", gap: 1 }}>
          {[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Portfolio", to: "/portfolio" },
          ].map(({ label, to }) => (
            <Button
              key={to}
              component={NavLink}
              to={to}
              sx={{
                color: "#e5e7eb",
                px: 3,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 500,
                textTransform: "none",

                "&.active": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                },

                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>

  );
};




export default Layout;
