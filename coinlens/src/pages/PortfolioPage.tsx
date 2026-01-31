import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromPortfolio } from "../redux/portfolio/portfolioSlice";
import { useGetTopCoinsQuery } from "../api/cryptoApi";

const PortfolioPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.portfolio.items);
  const { data: marketData } = useGetTopCoinsQuery();

  if (items.length === 0) {
    return <h1>Portfolio is empty</h1>;
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
    <div>
      <h1>Portfolio</h1>

      <table>
        <thead>
          <tr>
            <th align="left">Coin</th>
            <th align="right">Amount</th>
            <th align="right">Price (USD)</th>
            <th align="right">Value (USD)</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {enrichedItems.map((item) => (
            <tr key={item.coinId}>
              <td>{item.name}</td>
              <td align="right">{item.amount}</td>
              <td align="right">${item.price.toLocaleString()}</td>
              <td align="right">${item.value.toLocaleString()}</td>
              <td>
                <button
                  onClick={() => dispatch(removeFromPortfolio(item.coinId))}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Total value: ${totalValue.toLocaleString()}</h2>
    </div>
  );
};

export default PortfolioPage;
