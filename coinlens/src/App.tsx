import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import DashboardPage from "./pages/DashboardPage";
import CoinPage from "./pages/CoinPage";
import PortfolioPage from "./pages/PortfolioPage";
import Layout from "./components/Layout";
import { Box } from "@mui/material";

function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/coin/:id" element={<CoinPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
