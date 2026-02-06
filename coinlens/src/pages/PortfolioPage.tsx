import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateAmount } from "../redux/portfolio/portfolioSlice";
import { useGetTopCoinsQuery } from "../api/cryptoApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
} from "@mui/material";

import { EmptyPortfolio, ProfitLossSection } from "../components/ProfitLossSection";
import { PortfolioAllocation } from "../components/PortfolioAllocation";
import { PortfolioTable } from "../components/PortfolioTable";

const PortfolioPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.portfolio.items);
  const { data: marketData } = useGetTopCoinsQuery({ page: 1, perPage: 250 });

  const [editingCoinId, setEditingCoinId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const handleStartEdit = (coinId: string, currentAmount: number) => {
    setEditingCoinId(coinId);
    setEditAmount(currentAmount.toString());
  };

  const handleSaveEdit = (coinId: string, currentPrice: number) => {
    const newAmount = parseFloat(editAmount);
    if (!isNaN(newAmount) && newAmount > 0) {
      dispatch(updateAmount({ coinId, newAmount, currentPrice }));
      setEditingCoinId(null);
      setEditAmount("");
    }
  };

  const handleCancelEdit = () => {
    setEditingCoinId(null);
    setEditAmount("");
  };

  if (items.length === 0) {
    return (
      <EmptyPortfolio navigate={navigate} />
    );
  }

  const enrichedItems = items.map((item) => {
    const marketMap = new Map(marketData?.map((coin) => [coin.id, coin]) ?? []);

    const marketCoin = marketMap.get(item.coinId);

    const price = marketCoin?.current_price ?? 0;
    const value = price * item.amount;

    const pnl = value - item.investedUsd;
    const pnlPercent =
      item.investedUsd > 0 ? (pnl / item.investedUsd) * 100 : 0;

    return {
      ...item,
      symbol: marketCoin?.symbol?.toUpperCase() ?? item.name,
      price,
      value,
      pnl,
      pnlPercent,
    };
  });

  const totalValue = enrichedItems.reduce((sum, item) => sum + item.value, 0);
  const totalInvested = items.reduce((sum, item) => sum + item.investedUsd, 0);

  const totalPnl = totalValue - totalInvested;

  const pieData = enrichedItems.map((item) => ({
    name: item.name,
    symbol: item.symbol,
    value: item.value,
  }));

  const renderPieLabel = ({ percent }: { percent?: number }) => {
    if (percent === undefined) return "";
    return `${(percent * 100).toFixed(1)}%`;
  };
  const marketMap = new Map(marketData?.map((coin) => [coin.id, coin]) ?? []);

  return (
    <Box>
      <ProfitLossSection totalValue={totalValue} totalPnl={totalPnl} />
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <PortfolioAllocation pieData={pieData} renderPieLabel={renderPieLabel} />
        <Box sx={{ flex: 1, minWidth: 0, }}>
          <PortfolioTable enrichedItems={enrichedItems} navigate={navigate} marketMap={marketMap} editingCoinId={editingCoinId} editAmount={editAmount} setEditAmount={setEditAmount} handleSaveEdit={handleSaveEdit} handleCancelEdit={handleCancelEdit} handleStartEdit={handleStartEdit} />
        </Box>
      </Box>
    </Box>
  );
};

export default PortfolioPage;



