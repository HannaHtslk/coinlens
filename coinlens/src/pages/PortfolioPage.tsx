import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromPortfolio, updateAmount } from "../redux/portfolio/portfolioSlice";
import { useGetTopCoinsQuery } from "../api/cryptoApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getFallbackLetter, formatCompactNumber } from "../helpers/helpers";

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
      <Box>
        <Typography variant="h4" gutterBottom>
          Portfolio
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Your portfolio is empty. Add coins from the market.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            mt: 2,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
            backdropFilter: "blur(8px)",
            color: "text.primary",
            "&:hover": {
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.33), rgba(255,255,255,0))",
            },
          }}
        >
          Go to Market
        </Button>
      </Box>
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper sx={{
          p: 2, background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
          backdropFilter: "blur(8px)",
        }}>
          <Typography variant="body2" color="text.secondary">
            Total Value
          </Typography>
          <Typography variant="h5">${formatCompactNumber(totalValue)}</Typography>
        </Paper>

        <Paper sx={{
          p: 2, background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
          backdropFilter: "blur(8px)",
        }}>
          <Typography variant="body2" color="text.secondary">
            Total P / L
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: totalPnl >= 0 ? "success.main" : "error.main" }}
          >
            {totalPnl >= 0 ? '+' : '-'}${formatCompactNumber(Math.abs(totalPnl))}
          </Typography>
        </Paper>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ flex: "0 0 400px", minWidth: 0 }}>
          <Paper sx={{
            p: 3, background:
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
            backdropFilter: "blur(8px)",
          }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Allocation
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: { xs: 300, md: 450 },
              }}
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="38%"
                    outerRadius={110}
                    label={renderPieLabel}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value?: number) =>
                      value !== undefined ? `$${value.toLocaleString()}` : ""
                    }
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={80}
                    wrapperStyle={{
                      fontSize: "0.75rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, }}>
          <TableContainer
            component={Paper}
            sx={{
              overflowX: "auto",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
              backdropFilter: "blur(8px)",
            }}
          >
            <Table size="small" sx={{ tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "20%" }} />
                <col style={{ width: "19%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "6%" }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell>Coin</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Price (USD)</TableCell>
                  <TableCell align="right">Value (USD)</TableCell>
                  <TableCell align="right">P/L (USD)</TableCell>
                  <TableCell
                    align="right"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    P/L %
                  </TableCell>
                  <TableCell align="center" />
                </TableRow>
              </TableHead>

              <TableBody>
                {enrichedItems.map((item) => (
                  <TableRow key={item.coinId}>
                    <TableCell
                      sx={{
                        cursor: "pointer",
                        color: "primary.main",
                        fontWeight: 500,
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => navigate(`/coin/${item.coinId}`)}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          src={marketMap.get(item.coinId)?.image}
                          alt={item.name}
                          sx={{ width: 24, height: 24 }}
                          imgProps={{
                            loading: "lazy",
                            onError: (e) => {
                              (e.target as HTMLImageElement).src = "";
                            },
                          }}
                        >
                          {getFallbackLetter(item.name)}
                        </Avatar>

                        <span>{item.name}</span>
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      {editingCoinId === item.coinId ? (
                        <TextField
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(item.coinId, item.price);
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                          onBlur={() => {
                            const newAmount = parseFloat(editAmount);
                            if (!isNaN(newAmount) && newAmount > 0) {
                              handleSaveEdit(item.coinId, item.price);
                            } else {
                              handleCancelEdit();
                            }
                          }}
                          size="small"
                          type="number"
                          autoFocus
                          placeholder={`0.00001 ${item.symbol}`}
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-root": {
                              fontSize: "0.875rem",
                            },
                            "& input": {
                              textAlign: "right",
                              fontSize: "0.875rem",
                              py: 0.5,
                              px: 1,
                            },
                            "& input[type=number]": {
                              MozAppearance: "textfield",
                            },
                            "& input[type=number]::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",
                            },
                            "& input[type=number]::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",
                            },
                          }}
                          inputProps={{ min: 0, step: "any" }}
                        />
                      ) : (
                        <Box
                          onClick={() => handleStartEdit(item.coinId, item.amount)}
                          sx={{
                            cursor: "pointer",
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)",
                            },
                          }}
                        >
                          {item.amount}
                        </Box>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      ${formatCompactNumber(item.price)}
                    </TableCell>

                    <TableCell align="right">
                      ${formatCompactNumber(item.value)}
                    </TableCell>

                    <TableCell align="right">
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 500,
                          fontSize: 13,
                          bgcolor:
                            item.pnl >= 0
                              ? "rgba(76,175,80,0.15)"
                              : "rgba(244,67,54,0.15)",
                          color: item.pnl >= 0 ? "success.main" : "error.main",
                        }}
                      >
                        {item.pnl >= 0 ? '+' : '-'}${formatCompactNumber(Math.abs(item.pnl))}
                      </Box>
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 500,
                          fontSize: 13,
                          bgcolor:
                            item.pnl >= 0
                              ? "rgba(76,175,80,0.15)"
                              : "rgba(244,67,54,0.15)",
                          color: item.pnl >= 0 ? "success.main" : "error.main",
                        }}
                      >
                        {item.pnlPercent.toFixed(2)}%
                      </Box>
                    </TableCell>

                    <TableCell align="center" sx={{ p: 0.5 }}>
                      <IconButton
                        onClick={() =>
                          dispatch(removeFromPortfolio(item.coinId))
                        }
                        size="small"
                        sx={{
                          color: "text.secondary",
                          p: 0.5,
                          "&:hover": {
                            color: "text.primary",
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default PortfolioPage;



