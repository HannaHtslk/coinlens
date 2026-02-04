import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
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
import { CoinPageSkeleton } from "../components/CoinPageSkeleton";
import { CoinInfo } from "../components/CoinInfo";

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

  if (isLoading) return <CoinPageSkeleton />;
  if (error) return <p>Error loading coin</p>;
  if (!data) return null;

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack direction="row" spacing={4} alignItems="stretch">
          <Box sx={{ flex: "0 0 35%" }} >
            <CoinInfo data={data} amount={amount} setAmount={setAmount} justAdded={justAdded} setJustAdded={setJustAdded} dispatch={dispatch} id={id!} />
          </Box>

          <Box sx={{ flex: 1 }}>
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

            <Box sx={{ width: "100%", height: 320 }}>
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
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CoinPage;
