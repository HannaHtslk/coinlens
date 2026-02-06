import { Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";

export const Filters = ({ search, setSearch, setPage, marketFilter, setMarketFilter, setPendingPage }: { search: string, setSearch: (search: string) => void, setPage: (page: number) => void, marketFilter: string, setMarketFilter: (marketFilter: string) => void, setPendingPage: (pendingPage: number) => void }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Paper
            sx={{
                p: { xs: 1.5, sm: 2 },
                mb: { xs: 2, md: 3 },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                background: isDark
                    ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))"
                    : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))",
                backdropFilter: "blur(8px)",
            }}
        >
            <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={2}
            >
                <TextField
                    label="Search coin"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    fullWidth
                    sx={{ maxWidth: { sm: 240 } }}
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
                        width: { xs: "100%", sm: "auto" },
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        "& .MuiToggleButton-root": {
                            textTransform: "none",
                            px: { xs: 1.5, sm: 2 },
                            borderColor: "divider",
                            flex: { xs: "1 1 auto", sm: "0 0 auto" },
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
    );
};