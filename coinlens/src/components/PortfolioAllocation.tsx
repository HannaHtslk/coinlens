import { Box, Paper, Typography } from "@mui/material";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { chartColors, formatCompactNumber } from "../helpers/helpers";

export const PortfolioAllocation = ({ pieData, renderPieLabel }: { pieData: any, renderPieLabel: any }) => {

    return (
        <Box sx={{ flex: "0 0 400px", minWidth: 0 }}>
            <Paper sx={{
                p: 3, background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
                backdropFilter: "blur(8px)",
            }}>
                <Typography variant="h6" gutterBottom>
                    Portfolio Allocation
                </Typography>
                <Box
                    sx={{
                        width: "100%",
                        height: { xs: 300, md: 450 },
                    }}
                >
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                outerRadius={110}
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