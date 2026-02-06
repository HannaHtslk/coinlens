import { Box, Button, Paper, Typography } from "@mui/material";
import { formatCompactNumber } from "../helpers/helpers";

export const ProfitLossSection = ({ totalValue, totalPnl }: { totalValue: number, totalPnl: number }) => {
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
                p: 2, background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
                backdropFilter: "blur(8px)",
            }}>
                <Typography variant="body2" color="text.secondary">
                    Total Value
                </Typography>
                <Typography variant="h5">${formatCompactNumber(totalValue)}</Typography>
            </Paper>

            <Paper sx={{
                p: 2, background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
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
                    background:
                        "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
                    backdropFilter: "blur(8px)",
                    color: "text.primary",
                    "&:hover": {
                        background:
                            "linear-gradient(180deg, rgba(255, 255, 255, 0.33), rgba(255,255,255,0))",
                    },
                }}
            >
                Go to Market
            </Button>
        </Box>
    );
};