import { Avatar, Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography } from "@mui/material";
import { SkeletonLoader } from "./Skeleton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { formatCompactNumber } from "../helpers/helpers";
import type { CoinMarket } from "../types/coin";
import type { Dispatch } from "@reduxjs/toolkit";
import type { NavigateFunction } from "react-router-dom";
import { toggleFavorite } from "../redux/favorites/favoritesSlice";

export const CoinsTable = ({ filteredAndSortedData, isLoading, sortConfig, handleSort, favoriteIds, dispatch, navigate }: { filteredAndSortedData: CoinMarket[], isLoading: boolean, sortConfig: { key: string, direction: "asc" | "desc" }, handleSort: (key: string) => void, favoriteIds: string[], dispatch: Dispatch, navigate: NavigateFunction }) => {
    return (
        <Table sx={{
            tableLayout: "fixed",
            "& th, & td": {
                whiteSpace: "nowrap",
            },
        }}>
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox" sx={{ width: 48 }}></TableCell>
                    <TableCell sx={{ width: 240 }}>Coin</TableCell>
                    <TableCell
                        align="right"
                        sx={{ width: 140 }}
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
                        sx={{ width: 100 }}
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
                        sx={{ width: 160 }}
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
                        sx={{ width: 160 }}
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
                {isLoading ? <SkeletonLoader /> : (
                    filteredAndSortedData.map((coin) => (
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
                    ))
                )}
            </TableBody>
        </Table>
    );
};