import { Paper, Typography } from "@mui/material";

export const NoResults = ({ marketFilter }: { marketFilter: string }) => {
    return (
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
                No results found
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                {marketFilter === "fiat"
                    ? "There are no fiat assets available in the current market data."
                    : marketFilter === "favorites"
                        ? "You haven’t added any favorites yet."
                        : "Try adjusting your filters or search term."}
            </Typography>
        </Paper>
    );
};