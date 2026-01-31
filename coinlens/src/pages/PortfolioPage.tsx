import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromPortfolio } from "../redux/portfolio/portfolioSlice";

const PortfolioPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.portfolio.items);

  if (items.length === 0) {
    return <h1>Portfolio is empty</h1>;
  }

  return (
    <div>
      <h1>Portfolio</h1>

      <table>
        <thead>
          <tr>
            <th align="left">Coin</th>
            <th align="right">Amount</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.coinId}>
              <td>{item.name}</td>
              <td align="right">{item.amount}</td>
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
    </div>
  );
};

export default PortfolioPage;
