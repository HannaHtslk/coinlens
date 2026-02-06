import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { CoinDetails } from "../types/coin";
import { formatCompactNumber } from "../helpers/helpers";
import type { Dispatch } from "@reduxjs/toolkit";
import { addToPortfolio } from "../redux/portfolio/portfolioSlice";

export const CoinInfo = ({ data, amount, setAmount, justAdded, setJustAdded, dispatch, id }: { data: CoinDetails, amount: string, setAmount: (amount: string) => void, justAdded: boolean, setJustAdded: (justAdded: boolean) => void, dispatch: Dispatch, id: string }) => {
    return (
        <>
            <Stack direction="row" spacing={2} alignItems="center" mb={{ xs: 4, md: 10 }} justifyContent="center">
                <Box
                    component="img"
                    src={data.image.large}
                    alt={data.name}
                    sx={{ width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 } }}
                />

                <Box>
                    <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
                        {data.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                        {data.symbol.toUpperCase()}
                    </Typography>
                </Box>
            </Stack>

            <Stack spacing={1.2} mb={{ xs: 4, md: 10 }} justifyContent="center">
                <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    Current price: $
                    {formatCompactNumber(data.market_data.current_price.usd)}
                </Typography>

                <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    Market cap: $
                    {formatCompactNumber(data.market_data.market_cap.usd)}
                </Typography>
            </Stack>
            <Box sx={{ mt: { xs: 2, md: 3 } }}>
                <Stack 
                    direction={{ xs: "column", sm: "row" }} 
                    spacing={2} 
                    alignItems="center" 
                    justifyContent="center"
                >
                    <TextField
                        label="Amount"
                        type="number"
                        size="small"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Minimum 0.00001 ${data.symbol.toUpperCase()}`}
                        inputProps={{ min: 0, step: "any" }}
                        fullWidth
                        sx={{
                            maxWidth: { sm: 200 },
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
                    />

                    {!justAdded ? (
                        <Button
                            variant="contained"
                            disabled={
                                !amount ||
                                parseFloat(amount) <= 0 ||
                                isNaN(parseFloat(amount))
                            }
                            onClick={() => { const numAmount = parseFloat(amount); if (isNaN(numAmount) || numAmount <= 0) return; dispatch(addToPortfolio({ coinId: id!, name: data.name, amount: numAmount, investedUsd: data.market_data.current_price.usd * numAmount, })); setJustAdded(true); setAmount(""); setTimeout(() => { setJustAdded(false); }, 2000); }}
                            fullWidth
                            sx={{ maxWidth: { sm: "auto" } }}
                        >
                            Add to portfolio
                        </Button>
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{ color: "success.main", fontWeight: 500 }}
                        >
                            ✓ Successfully added
                        </Typography>
                    )}
                </Stack>

                {!justAdded &&
                    parseFloat(amount) > 0 &&
                    !isNaN(parseFloat(amount)) && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Total cost: $
                            {formatCompactNumber(
                                data.market_data.current_price.usd * parseFloat(amount)
                            )}
                        </Typography>
                    )}
            </Box>
        </>
    );
};