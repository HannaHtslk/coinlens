import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { addToPortfolio } from "../redux/portfolio/portfolioSlice";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";

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

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() =>
            dispatch(
              addToPortfolio({
                coinId: id!,
                name: data.name,
                amount: 1,
              })
            )
          }
        >
          Add to portfolio
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant={days === 7 ? "contained" : "outlined"}
            onClick={() => setDays(7)}
          >
            7d
          </Button>

          <Button
            variant={days === 30 ? "contained" : "outlined"}
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
                  stroke="#4f8cff"
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
