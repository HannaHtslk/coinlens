import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromPortfolio } from "../redux/portfolio/portfolioSlice";
import { useGetTopCoinsQuery } from "../api/cryptoApi";
import { useNavigate } from "react-router-dom";
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
  Button,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PortfolioPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.portfolio.items);
  const { data: marketData } = useGetTopCoinsQuery();

  if (items.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Portfolio
        </Typography>
        <Typography color="text.secondary">
          Your portfolio is empty. Add coins from the market.
        </Typography>
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ flex: "0 0 400px", minWidth: 0 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Allocation
            </Typography>
            <Box sx={{ width: "100%", height: 450 }}>
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
                  <Legend verticalAlign="bottom" height={80} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Coin</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Price (USD)</TableCell>
                  <TableCell align="right">Value (USD)</TableCell>
                  <TableCell align="right">P/L (USD)</TableCell>
                  <TableCell align="right">P/L %</TableCell>
                  <TableCell />
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
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() => navigate(`/coin/${item.coinId}`)}
                    >
                      {item.name}
                    </TableCell>

                    <TableCell align="right">{item.amount}</TableCell>

                    <TableCell align="right">
                      ${item.price.toLocaleString()}
                    </TableCell>

                    <TableCell align="right">
                      ${item.value.toLocaleString()}
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        color: item.pnl >= 0 ? "success.main" : "error.main",
                      }}
                    >
                      ${item.pnl.toLocaleString()}
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        color: item.pnl >= 0 ? "success.main" : "error.main",
                      }}
                    >
                      {item.pnlPercent.toFixed(2)}%
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        color="error"
                        onClick={() =>
                          dispatch(removeFromPortfolio(item.coinId))
                        }
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow
                  sx={{
                    backgroundColor: "action.hover",
                    "& td": {
                      fontWeight: 600,
                      fontSize: "1rem",
                    },
                  }}
                >
                  <TableCell>Total</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">
                    ${totalValue.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: totalPnl >= 0 ? "success.main" : "error.main",
                    }}
                  >
                    ${totalPnl.toLocaleString()}
                  </TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default PortfolioPage;
