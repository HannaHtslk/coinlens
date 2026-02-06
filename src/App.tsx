import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import DashboardPage from "./pages/DashboardPage";
import CoinPage from "./pages/CoinPage";
import PortfolioPage from "./pages/PortfolioPage";
import Layout from "./components/Layout";
import { Container } from "@mui/material";

function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Container maxWidth={false} sx={{ py: 4 }} disableGutters>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/coin/:id" element={<CoinPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
