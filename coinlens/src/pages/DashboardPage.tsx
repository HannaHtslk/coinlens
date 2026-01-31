import { useGetTopCoinsQuery } from "../api/cryptoApi";

const DashboardPage = () => {
    const { data, isLoading, error } = useGetTopCoinsQuery();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    return (
        <div>
            <h1>Market</h1>

            <table>
                <thead>
                    <tr>
                        <th align="left">Name</th>
                        <th align="right">Price (USD)</th>
                        <th align="right">24h %</th>
                        <th align="right">Market Cap</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.map((coin) => (
                        <tr key={coin.id}>
                            <td>{coin.name}</td>
                            <td align="right">
                                ${coin.current_price.toLocaleString()}
                            </td>
                            <td align="right">
                                {coin.price_change_percentage_24h?.toFixed(2)}%
                            </td>
                            <td align="right">
                                ${coin.market_cap.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardPage;
