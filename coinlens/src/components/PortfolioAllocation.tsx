import { Box, Paper, Typography, useTheme } from "@mui/material";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { chartColors, formatCompactNumber } from "../helpers/helpers";

export const PortfolioAllocation = ({ pieData, renderPieLabel }: { pieData: any, renderPieLabel: any }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ 
            flex: { xs: "1", md: "0 0 400px" }, 
            minWidth: 0 
        }}>
            <Paper sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                background: isDark
                    ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))"
                    : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))",
                backdropFilter: "blur(8px)",
            }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
                    Portfolio Allocation
                </Typography>
                <Box
                    sx={{
                        width: "100%",
                        height: { xs: 320, sm: 360, md: 480 },
                        position: "relative",
                    }}
                >
                    <ResponsiveContainer>
                        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="42%"
                                outerRadius="60%"
                                label={renderPieLabel}
                            >
                                {pieData.map((item: any, index: number) => (
                                    <Cell
                                        key={item.name}
                                        fill={chartColors[index % chartColors.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value?: number) =>
                                    value !== undefined ? `$${formatCompactNumber(value)}` : ""
                                }
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={100}
                                wrapperStyle={{
                                    fontSize: "0.875rem",
                                    paddingTop: "20px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Box>
    );
};