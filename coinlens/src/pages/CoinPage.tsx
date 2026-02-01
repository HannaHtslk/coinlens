import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { addToPortfolio } from "../redux/portfolio/portfolioSlice";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import {
  useGetCoinByIdQuery,
  useGetCoinMarketChartQuery,
} from "../api/cryptoApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CoinPage = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<{ id: string }>();
  const [days, setDays] = useState<7 | 30>(7);
  const [justAdded, setJustAdded] = useState(false);
  const [amount, setAmount] = useState<string>("");

  const { data, isLoading, error } = useGetCoinByIdQuery(id!);

  const { data: chartData, isLoading: isChartLoading } =
    useGetCoinMarketChartQuery({
      coinId: id!,
      days,
    });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading coin</p>;
  if (!data) return null;

  const prices =
    chartData?.prices.map((item: [number, number]) => ({
      time: new Date(item[0]).toLocaleDateString(),
      price: item[1],
    })) ?? [];

  const trend =
    prices.length > 1 && prices[prices.length - 1].price >= prices[0].price
      ? "up"
      : "down";

  const lineColor = trend === "up" ? "#2e7d32" : "#d32f2f";

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {data.name}
        </Typography>

        <Typography color="text.secondary">
          Symbol: {data.symbol.toUpperCase()}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          Current price: ${data.market_data.current_price.usd.toLocaleString()}
        </Typography>

        <Typography>
          Market cap: ${data.market_data.market_cap.usd.toLocaleString()}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Amount"
              type="number"
              size="small"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Minimum 0.00001 ${data.symbol.toUpperCase()}`}
              inputProps={{ min: 0, step: "any" }}
              sx={{
                width: 200,
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />

            {!justAdded ? (
              <Button
                variant="contained"
                color="primary"
                disabled={
                  !amount || amount.trim() === "" || parseFloat(amount) <= 0
                }
                onClick={() => {
                  const numAmount = parseFloat(amount);
                  if (isNaN(numAmount) || numAmount <= 0) return;

                  dispatch(
                    addToPortfolio({
                      coinId: id!,
                      name: data.name,
                      amount: numAmount,
                      investedUsd:
                        data.market_data.current_price.usd * numAmount,
                    })
                  );

                  setJustAdded(true);
                  setAmount("");

                  setTimeout(() => {
                    setJustAdded(false);
                  }, 2000);
                }}
              >
                Add to portfolio
              </Button>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "success.main", fontWeight: 500 }}
              >
                ✓ Successfully added to portfolio
              </Typography>
            )}
          </Stack>

          {!justAdded &&
            parseFloat(amount) > 0 &&
            !isNaN(parseFloat(amount)) && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total cost: $
                {(
                  data.market_data.current_price.usd * parseFloat(amount)
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant={days === 7 ? "contained" : "outlined"}
            disabled={days === 7}
            onClick={() => setDays(7)}
          >
            7d
          </Button>

          <Button
            variant={days === 30 ? "contained" : "outlined"}
            disabled={days === 30}
            onClick={() => setDays(30)}
          >
            30d
          </Button>
        </Stack>

        <Box sx={{ width: "100%", height: 300 }}>
          {isChartLoading ? (
            <Typography>Loading chart...</Typography>
          ) : (
            <ResponsiveContainer>
              <LineChart data={prices}>
                <XAxis dataKey="time" hide />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CoinPage;
