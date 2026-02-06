import { Avatar, Box, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, useTheme } from "@mui/material";
import { formatCompactNumber, getFallbackLetter } from "../helpers/helpers";
import { removeFromPortfolio } from "../redux/portfolio/portfolioSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch } from "../store/hooks";


export const PortfolioTable = ({ enrichedItems, navigate, marketMap, editingCoinId, editAmount, setEditAmount, handleSaveEdit, handleCancelEdit, handleStartEdit }: { enrichedItems: any, navigate: any, marketMap: any, editingCoinId: any, editAmount: any, setEditAmount: any, handleSaveEdit: any, handleCancelEdit: any, handleStartEdit: any }) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <TableContainer
            component={Paper}
            sx={{
                overflowX: "auto",
                background: isDark
                    ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))"
                    : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))",
                backdropFilter: "blur(8px)",
            }}
        >
            <Table size="small" sx={{ tableLayout: "fixed" }}>
                <colgroup>
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "19%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "6%" }} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Coin</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Price (USD)</TableCell>
                        <TableCell align="right">Value (USD)</TableCell>
                        <TableCell align="right">P/L (USD)</TableCell>
                        <TableCell
                            align="right"
                            sx={{ display: { xs: "none", md: "table-cell" } }}
                        >
                            P/L %
                        </TableCell>
                        <TableCell align="center" />
                    </TableRow>
                </TableHead>

                <TableBody>
                    {enrichedItems.map((item: any) => (
                        <TableRow key={item.coinId}>
                            <TableCell
                                sx={{
                                    cursor: "pointer",
                                    color: "primary.main",
                                    fontWeight: 500,
                                    "&:hover": { textDecoration: "underline" },
                                }}
                                onClick={() => navigate(`/coin/${item.coinId}`)}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Avatar
                                        src={marketMap.get(item.coinId)?.image}
                                        alt={item.name}
                                        sx={{ width: 24, height: 24 }}
                                        imgProps={{
                                            loading: "lazy",
                                            onError: (e) => {
                                                (e.target as HTMLImageElement).src = "";
                                            },
                                        }}
                                    >
                                        {getFallbackLetter(item.name)}
                                    </Avatar>

                                    <span>{item.name}</span>
                                </Stack>
                            </TableCell>

                            <TableCell align="right">
                                {editingCoinId === item.coinId ? (
                                    <TextField
                                        value={editAmount}
                                        onChange={(e) => setEditAmount(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleSaveEdit(item.coinId, item.price);
                                            } else if (e.key === "Escape") {
                                                handleCancelEdit();
                                            }
                                        }}
                                        onBlur={() => {
                                            const newAmount = parseFloat(editAmount);
                                            if (!isNaN(newAmount) && newAmount > 0) {
                                                handleSaveEdit(item.coinId, item.price);
                                            } else {
                                                handleCancelEdit();
                                            }
                                        }}
                                        size="small"
                                        type="number"
                                        autoFocus
                                        placeholder={`0.00001 ${item.symbol}`}
                                        sx={{
                                            width: "100%",
                                            "& .MuiInputBase-root": {
                                                fontSize: "0.875rem",
                                            },
                                            "& input": {
                                                textAlign: "right",
                                                fontSize: "0.875rem",
                                                py: 0.5,
                                                px: 1,
                                            },
                                            "& input[type=number]": {
                                                MozAppearance: "textfield",
                                            },
                                            "& input[type=number]::-webkit-outer-spin-button": {
                                                WebkitAppearance: "none",
                                            },
                                            "& input[type=number]::-webkit-inner-spin-button": {
                                                WebkitAppearance: "none",
                                            },
                                        }}
                                        inputProps={{ min: 0, step: "any" }}
                                    />
                                ) : (
                                    <Box
                                        onClick={() => handleStartEdit(item.coinId, item.amount)}
                                        sx={{
                                            cursor: "pointer",
                                            py: 0.5,
                                            px: 1,
                                            borderRadius: 1,
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)",
                                            },
                                        }}
                                    >
                                        {item.amount}
                                    </Box>
                                )}
                            </TableCell>

                            <TableCell align="right">
                                ${formatCompactNumber(item.price)}
                            </TableCell>

                            <TableCell align="right">
                                ${formatCompactNumber(item.value)}
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
                                            item.pnl >= 0
                                                ? "rgba(76,175,80,0.15)"
                                                : "rgba(244,67,54,0.15)",
                                        color: item.pnl >= 0 ? "success.main" : "error.main",
                                    }}
                                >
                                    {item.pnl >= 0 ? '+' : '-'}${formatCompactNumber(Math.abs(item.pnl))}
                                </Box>
                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{
                                    display: { xs: "none", md: "table-cell" },
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontWeight: 500,
                                        fontSize: 13,
                                        bgcolor:
                                            item.pnl >= 0
                                                ? "rgba(76,175,80,0.15)"
                                                : "rgba(244,67,54,0.15)",
                                        color: item.pnl >= 0 ? "success.main" : "error.main",
                                    }}
                                >
                                    {item.pnlPercent.toFixed(2)}%
                                </Box>
                            </TableCell>

                            <TableCell align="center" sx={{ p: 0.5 }}>
                                <IconButton
                                    onClick={() =>
                                        dispatch(removeFromPortfolio(item.coinId))
                                    }
                                    size="small"
                                    sx={{
                                        color: "text.secondary",
                                        p: 0.5,
                                        "&:hover": {
                                            color: "text.primary",
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        },
                                    }}
                                >
                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};