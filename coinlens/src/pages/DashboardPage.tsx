import { useGetTopCoinsQuery } from "../api/cryptoApi";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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
  Avatar,
} from "@mui/material";
import { getFallbackLetter } from "../helpers/helpers";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetTopCoinsQuery(undefined, {
    pollingInterval: 30000,
  });
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: "price" | "marketCap" | "change24h" | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const handleSort = (key: "price" | "marketCap" | "change24h") => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "desc") {
        setSortConfig({ key, direction: "asc" });
      } else if (sortConfig.direction === "asc") {
        setSortConfig({ key: null, direction: null });
      }
    } else {
      setSortConfig({ key, direction: "desc" });
    }
  };

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    let result = data.filter((coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sortConfig.key && sortConfig.direction) {
      result = [...result].sort((a, b) => {
        let aValue = 0;
        let bValue = 0;

        if (sortConfig.key === "price") {
          aValue = a.current_price;
          bValue = b.current_price;
        } else if (sortConfig.key === "marketCap") {
          aValue = a.market_cap;
          bValue = b.market_cap;
        } else if (sortConfig.key === "change24h") {
          aValue = a.price_change_percentage_24h ?? 0;
          bValue = b.price_change_percentage_24h ?? 0;
        }

        if (sortConfig.direction === "desc") {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
      });
    }

    return result;
  }, [data, search, sortConfig]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div>
      <Box mb={3}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Search coin"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            variant={sortConfig.key === "price" ? "contained" : "outlined"}
            onClick={() => handleSort("price")}
          >
            Price
          </Button>

          <Button
            variant={sortConfig.key === "marketCap" ? "contained" : "outlined"}
            onClick={() => handleSort("marketCap")}
          >
            Market Cap
          </Button>

          <Button
            variant={sortConfig.key === "change24h" ? "contained" : "outlined"}
            onClick={() => handleSort("change24h")}
          >
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
                <TableCell
                  sx={{
                    cursor: "pointer",
                    color: "primary.main",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => navigate(`/coin/${coin.id}`)}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={coin.image}
                      alt={coin.name}
                      sx={{ width: 24, height: 24 }}
                      imgProps={{
                        loading: "lazy",
                        onError: (e) => {
                          (e.target as HTMLImageElement).src = "";
                        },
                      }}
                    >
                      {getFallbackLetter(coin.name)}
                    </Avatar>

                    <span>{coin.name}</span>
                  </Stack>
                </TableCell>
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
