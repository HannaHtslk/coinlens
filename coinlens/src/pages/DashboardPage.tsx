import { useGetTopCoinsQuery } from "../api/cryptoApi";
import { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";

const DashboardPage = () => {
  const { data, isLoading, error } = useGetTopCoinsQuery();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<
    "price" | "marketCap" | "change24h" | null
  >(null);

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    let result = data.filter((coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sortKey === "price") {
      result = [...result].sort((a, b) => b.current_price - a.current_price);
    }

    if (sortKey === "marketCap") {
      result = [...result].sort((a, b) => b.market_cap - a.market_cap);
    }

    if (sortKey === "change24h") {
      result = [...result].sort(
        (a, b) =>
          (b.price_change_percentage_24h ?? 0) -
          (a.price_change_percentage_24h ?? 0)
      );
    }

    return result;
  }, [data, search, sortKey]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div>
      <h1>Market</h1>

      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Market
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Search coin"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button variant="contained" onClick={() => setSortKey("price")}>
            Price
          </Button>

          <Button variant="contained" onClick={() => setSortKey("marketCap")}>
            Market Cap
          </Button>

          <Button variant="contained" onClick={() => setSortKey("change24h")}>
            24h %
          </Button>
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Coin</TableCell>
              <TableCell align="right">Price (USD)</TableCell>
              <TableCell align="right">24h %</TableCell>
              <TableCell align="right">Market Cap</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAndSortedData.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell>{coin.name}</TableCell>
                <TableCell align="right">
                  ${coin.current_price.toLocaleString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      coin.price_change_percentage_24h &&
                      coin.price_change_percentage_24h > 0
                        ? "success.main"
                        : "error.main",
                  }}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </TableCell>
                <TableCell align="right">
                  ${coin.market_cap.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DashboardPage;
