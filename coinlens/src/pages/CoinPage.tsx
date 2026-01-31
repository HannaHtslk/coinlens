import { useParams } from "react-router-dom";
import { useGetCoinByIdQuery } from "../api/cryptoApi";

const CoinPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useGetCoinByIdQuery(id!);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading coin</p>;
    if (!data) return null;

    return (
        <div>
            <h1>{data.name}</h1>

            <p>Symbol: {data.symbol.toUpperCase()}</p>
            <p>Current price: ${data.market_data.current_price.usd}</p>
            <p>Market cap: ${data.market_data.market_cap.usd}</p>
        </div>
    );
};

export default CoinPage;
