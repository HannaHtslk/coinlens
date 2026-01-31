import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToPortfolio } from "../redux/portfolio/portfolioSlice";

const PortfolioPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.portfolio.items);

  useEffect(() => {
    dispatch(
      addToPortfolio({
        coinId: "bitcoin",
        name: "Bitcoin",
        amount: 0.5,
      })
    );
  }, [dispatch]);

  return (
    <div>
      <h1>Portfolio</h1>

      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
};

export default PortfolioPage;
