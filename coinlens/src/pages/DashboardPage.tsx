import { useGetTopCoinsQuery } from "../api/cryptoApi";
import { useState, useMemo, useEffect } from "react";
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
  const FILTERED_PER_PAGE = 250;

  const [marketFilter, setMarketFilter] = useState<MarketFilter>("all");
  const [page, setPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);


  useEffect(() => {
    if (pendingPage === page) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setPage(pendingPage);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [pendingPage, page]);

  const [search, setSearch] = useState("");
  const isFiltered = marketFilter !== "all" || search.trim().length > 0;

  const { data, isLoading, error } = useGetTopCoinsQuery({
    page: isFiltered ? 1 : page,
    perPage: isFiltered ? FILTERED_PER_PAGE : PER_PAGE,
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const hasNextPage = !isFiltered && data?.length === PER_PAGE;

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

  const allFilteredData = useMemo(() => {
    if (!data) return [];

    return filterAndSortCoins(data, {
      search,
      marketFilter,
      favoriteIds,
      sortConfig,
    });
  }, [data, search, sortConfig, marketFilter, favoriteIds]);

  const filteredAndSortedData = useMemo(() => {
    if (!isFiltered) return allFilteredData;

    const startIndex = (filteredPage - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    return allFilteredData.slice(startIndex, endIndex);
  }, [allFilteredData, filteredPage, isFiltered, PER_PAGE]);

  const totalFilteredPages = Math.ceil(allFilteredData.length / PER_PAGE);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      setPendingPage(1);
      setFilteredPage(1);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [marketFilter, search]);

  const isEmpty = allFilteredData.length === 0;


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
          flexDirection: "column",
          alignItems: "center",
          mt: 3,
          gap: 1,
        }}
      >
        {isFiltered ? (
          totalFilteredPages > 1 && (
            <Pagination
              page={filteredPage}
              count={totalFilteredPages}
              onChange={(_, value) => setFilteredPage(value)}
            />
          )
        ) : (
          <>
            <Pagination
              page={pendingPage}
              count={pendingPage + (hasNextPage ? 1 : 0)}
              onChange={(_, value) => setPendingPage(value)}
              disabled={isLoading}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default DashboardPage;
