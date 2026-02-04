import { Paper, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";

export const Filters = ({ search, setSearch, setPage, marketFilter, setMarketFilter, setPendingPage }: { search: string, setSearch: (search: string) => void, setPage: (page: number) => void, marketFilter: string, setMarketFilter: (marketFilter: string) => void, setPendingPage: (pendingPage: number) => void }) => {
    return (
        <Paper
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
            }}
        >
            <Stack direction="row" spacing={2}>
                <TextField
                    label="Search coin"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
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
                        "& .MuiToggleButton-root": {
                            textTransform: "none",
                            px: 2,
                            borderColor: "divider",
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