import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromPortfolio } from "../redux/portfolio/portfolioSlice";
import { useGetTopCoinsQuery } from "../api/cryptoApi";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const PortfolioPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.portfolio.items);
  const { data: marketData } = useGetTopCoinsQuery();

  if (items.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Portfolio
        </Typography>
        <Typography color="text.secondary">
          Your portfolio is empty. Add coins from the market.
        </Typography>
      </Box>
    );
  }

  const enrichedItems = items.map((item) => {
    const marketCoin = marketData?.find((coin) => coin.id === item.coinId);

    const price = marketCoin?.current_price ?? 0;
    const value = price * item.amount;

    return {
      ...item,
      price,
      value,
    };
  });

  const totalValue = enrichedItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Portfolio
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Coin</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Price (USD)</TableCell>
              <TableCell align="right">Value (USD)</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {enrichedItems.map((item) => (
              <TableRow key={item.coinId}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">{item.amount}</TableCell>
                <TableCell align="right">
                  ${item.price.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  ${item.value.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <Button
                    color="error"
                    onClick={() => dispatch(removeFromPortfolio(item.coinId))}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" sx={{ mt: 3 }}>
        Total value: ${totalValue.toLocaleString()}
      </Typography>
    </Box>
  );
};

export default PortfolioPage;
