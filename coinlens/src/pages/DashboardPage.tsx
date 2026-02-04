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
import {
  filterAndSortCoins,
  type MarketFilter,
  type SortConfig,
} from "../helpers/helpers";

import { Filters } from "../components/Filters";
import { NoResults } from "../components/NoResults";
import { CoinsTable } from "../components/CoinsTable";

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.ids);

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
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const hasNextPage = data?.length === PER_PAGE;
  const isFiltered = marketFilter !== "all" || search.trim().length > 0;

  const handleSort = (key: string) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "desc") {
        setSortConfig({ key: key as SortConfig["key"], direction: "asc" });
      } else if (sortConfig.direction === "asc") {
        setSortConfig({ key: null, direction: null });
      }
    } else {
      setSortConfig({ key: key as SortConfig["key"], direction: "desc" });
    }
  };

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    return filterAndSortCoins(data, {
      search,
      marketFilter,
      favoriteIds,
      sortConfig,
    });
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
          <CoinsTable filteredAndSortedData={filteredAndSortedData} isLoading={isLoading} sortConfig={{ key: sortConfig.key ?? "", direction: sortConfig.direction ?? "asc" }} handleSort={handleSort} favoriteIds={favoriteIds} dispatch={dispatch} navigate={navigate} />
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
