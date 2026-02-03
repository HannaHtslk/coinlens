import { useGetTopCoinsQuery } from "../api/cryptoApi";
import { useState, useMemo, useEffect, useRef } from "react";
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
  Stack,
  Avatar,
  Pagination,
  IconButton,
  TableSortLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Skeleton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleFavorite } from "../redux/favorites/favoritesSlice";
import { formatCompactNumber, isFiat, isStableCoin } from "../helpers/helpers";

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.ids);

  type MarketFilter = "all" | "favorites" | "crypto" | "stable" | "fiat";
  const PER_PAGE = 20;

  const [marketFilter, setMarketFilter] = useState<MarketFilter>("all");
  const [page, setPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);

  const lastRequestRef = useRef<number>(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const now = Date.now();

      if (now - lastRequestRef.current < 800) return;

      lastRequestRef.current = now;
      setPage(pendingPage);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [pendingPage]);

  const { data, isLoading, error } = useGetTopCoinsQuery(page);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: "price" | "marketCap" | "change24h" | "volume" | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });
  const hasNextPage = data?.length === PER_PAGE;
  const isFiltered = marketFilter !== "all" || search.trim().length > 0;

  const handleSort = (key: "price" | "marketCap" | "change24h" | "volume") => {
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
    if (marketFilter === "favorites") {
      result = result.filter((coin) => favoriteIds.includes(coin.id));
    }

    if (marketFilter === "stable") {
      result = result.filter((coin) => isStableCoin(coin.symbol));
    }

    if (marketFilter === "fiat") {
      result = result.filter((coin) => isFiat(coin.symbol));
    }

    if (marketFilter === "crypto") {
      result = result.filter(
        (coin) => !isStableCoin(coin.symbol) && !isFiat(coin.symbol)
      );
    }

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
        } else if (sortConfig.key === "volume") {
          aValue = a.total_volume;
          bValue = b.total_volume;
        }

        if (sortConfig.direction === "asc") {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
      });
    }

    return result;
  }, [data, search, sortConfig, marketFilter, favoriteIds]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      setPendingPage(1);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [marketFilter, search]);

  const isEmpty = filteredAndSortedData.length === 0;

  if (isLoading)
    return (
      <TableBody>
        {[...Array(8)].map((_, i) => (
          <TableRow key={i}>
            <TableCell padding="checkbox">
              <Skeleton variant="circular" width={20} height={20} />
            </TableCell>

            <TableCell>
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton width={120} />
              </Stack>
            </TableCell>

            <TableCell align="right">
              <Skeleton width={80} />
            </TableCell>

            <TableCell align="right">
              <Skeleton width={60} />
            </TableCell>

            <TableCell align="right">
              <Skeleton width={90} />
            </TableCell>

            <TableCell align="right">
              <Skeleton width={90} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  if (error) return <p>Error loading data</p>;

  return (
    <div>
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            label="Search coin"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <ToggleButtonGroup
            value={marketFilter}
            exclusive
            size="small"
            onChange={(_, value) => {
              if (!value) return;
              setMarketFilter(value);
              setPage(1);
              setPendingPage(1);
            }}
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                px: 2,
                borderColor: "divider",
              },
              "& .Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="favorites">Favorites</ToggleButton>
            <ToggleButton value="crypto">Crypto</ToggleButton>
            <ToggleButton value="stable">Stable</ToggleButton>
            <ToggleButton value="fiat">Fiat</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>
      {isEmpty ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            No results found
          </Typography>

          <Typography color="text.secondary">
            {marketFilter === "fiat"
              ? "There are no fiat assets available in the current market data."
              : marketFilter === "favorites"
                ? "You haven’t added any favorites yet."
                : "Try adjusting your filters or search term."}
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Coin</TableCell>
                <TableCell
                  align="right"
                  sortDirection={
                    sortConfig.key === "price"
                      ? (sortConfig.direction ?? undefined)
                      : undefined
                  }
                >
                  <TableSortLabel
                    active={sortConfig.key === "price"}
                    direction={
                      sortConfig.key === "price" && sortConfig.direction
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort("price")}
                  >
                    Price (USD)
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="right"
                  sortDirection={
                    sortConfig.key === "change24h"
                      ? (sortConfig.direction ?? undefined)
                      : undefined
                  }
                >
                  <TableSortLabel
                    active={sortConfig.key === "change24h"}
                    direction={
                      sortConfig.key === "change24h" && sortConfig.direction
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort("change24h")}
                  >
                    24h %
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="right"
                  sortDirection={
                    sortConfig.key === "volume"
                      ? (sortConfig.direction ?? undefined)
                      : undefined
                  }
                >
                  <TableSortLabel
                    active={sortConfig.key === "volume"}
                    direction={
                      sortConfig.key === "volume" && sortConfig.direction
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort("volume")}
                  >
                    Volume (24h)
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  align="right"
                  sortDirection={
                    sortConfig.key === "marketCap"
                      ? (sortConfig.direction ?? undefined)
                      : undefined
                  }
                >
                  <TableSortLabel
                    active={sortConfig.key === "marketCap"}
                    direction={
                      sortConfig.key === "marketCap" && sortConfig.direction
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort("marketCap")}
                  >
                    Market Cap
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAndSortedData.map((coin) => (
                <TableRow
                  key={coin.id}
                  hover
                  sx={{
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.04)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleFavorite(coin.id));
                      }}
                    >
                      {favoriteIds.includes(coin.id) ? (
                        <StarIcon color="warning" fontSize="small" />
                      ) : (
                        <StarBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>

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
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={coin.image}
                        alt={coin.name}
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: "background.paper",
                        }}
                      />

                      <Box>
                        <Typography fontWeight={500}>{coin.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {coin.symbol.toUpperCase()}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    ${coin.current_price.toLocaleString()}
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
                          coin.price_change_percentage_24h &&
                          coin.price_change_percentage_24h > 0
                            ? "rgba(76,175,80,0.15)"
                            : "rgba(244,67,54,0.15)",
                        color:
                          coin.price_change_percentage_24h &&
                          coin.price_change_percentage_24h > 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    ${formatCompactNumber(coin.total_volume)}
                  </TableCell>
                  <TableCell align="right">
                    ${formatCompactNumber(coin.market_cap)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
        }}
      >
        {!isFiltered && (
          <Pagination
            page={pendingPage}
            count={pendingPage + (hasNextPage ? 1 : 0)}
            onChange={(_, value) => setPendingPage(value)}
          />
        )}
      </Box>
    </div>
  );
};

export default DashboardPage;
