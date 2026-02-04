import { Paper, Typography } from "@mui/material";

export const NoResults = ({ marketFilter }: { marketFilter: string }) => {
    return (
        <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
                No results found
            </Typography>

            <Typography color="text.secondary">
                {marketFilter === "fiat"
                    ? "There are no fiat assets available in the current market data."
                    : marketFilter === "favorites"
                        ? "You haven’t added any favorites yet."
                        : "Try adjusting your filters or search term."}
            </Typography>
        </Paper>
    );
};