import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          CoinLens
        </Typography>

        <Box>
          <Button
            component={NavLink}
            to="/"
            sx={{
              color: "inherit",
              "&.active": {
                color: "primary.main",
              },
            }}
          >
            Dashboard
          </Button>

          <Button
            component={NavLink}
            to="/portfolio"
            sx={{
              color: "inherit",
              "&.active": {
                color: "primary.main",
              },
            }}
          >
            Portfolio
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Layout;
