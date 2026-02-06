import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { formatCompactNumber } from "../helpers/helpers";

export const ProfitLossSection = ({ totalValue, totalPnl }: { totalValue: number, totalPnl: number }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const paperBg = isDark
        ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))"
        : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))";

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 3,
            }}
        >
            <Paper sx={{
                p: 2,
                background: paperBg,
                backdropFilter: "blur(8px)",
            }}>
                <Typography variant="body2" color="text.secondary">
                    Total Value
                </Typography>
                <Typography variant="h5">${formatCompactNumber(totalValue)}</Typography>
            </Paper>

            <Paper sx={{
                p: 2,
                background: paperBg,
                backdropFilter: "blur(8px)",
            }}>
                <Typography variant="body2" color="text.secondary">
                    Total P / L
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: totalPnl >= 0 ? "success.main" : "error.main" }}
                >
                    {totalPnl >= 0 ? '+' : '-'}${formatCompactNumber(Math.abs(totalPnl))}
                </Typography>
            </Paper>
        </Box>
    );
};

export const EmptyPortfolio = ({ navigate }: { navigate: any }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Portfolio
            </Typography>
            <Typography color="text.secondary" gutterBottom>
                Your portfolio is empty. Add coins from the market.
            </Typography>
            <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{
                    mt: 2,
                    background: isDark
                        ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))"
                        : "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0))",
                    backdropFilter: "blur(8px)",
                    color: "text.primary",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        background: isDark
                            ? "linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255,255,255,0))"
                            : "linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0,0,0,0))",
                    },
                }}
            >
                Go to Market
            </Button>
        </Box>
    );
};