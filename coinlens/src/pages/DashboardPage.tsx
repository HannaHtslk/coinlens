import { useGetTopCoinsQuery } from "../api/cryptoApi";
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  TableContainer,
  Paper,
  Pagination,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { isFiat, isStableCoin } from "../helpers/helpers";

import { Filters } from "../components/Filters";
import { NoResults } from "../components/NoResults";
import { CoinsTable } from "../components/CoinsTable";

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


  if (error) return <p>Error loading data</p>;

  return (
    <>
      <Filters search={search} setSearch={setSearch} setPage={setPage} marketFilter={marketFilter} setMarketFilter={(value) => setMarketFilter(value as MarketFilter)} setPendingPage={setPendingPage} />
      {isEmpty && !isLoading ? (
        <NoResults marketFilter={marketFilter} />
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
          <CoinsTable filteredAndSortedData={filteredAndSortedData} isLoading={isLoading} sortConfig={{ key: sortConfig.key ?? "", direction: sortConfig.direction ?? "asc" }} handleSort={(key) => handleSort(key as "price" | "marketCap" | "change24h" | "volume")} favoriteIds={favoriteIds} dispatch={dispatch} navigate={navigate} />
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
    </>
  );
};

export default DashboardPage;
