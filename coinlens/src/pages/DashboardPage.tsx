import { useGetTopCoinsQuery } from "../api/cryptoApi";
import { useState, useMemo } from "react";

const DashboardPage = () => {
    const { data, isLoading, error } = useGetTopCoinsQuery();
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<
        "price" | "marketCap" | "change24h" | null
    >(null);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    const filteredAndSortedData = useMemo(() => {
        if (!data) return [];

        let result = data.filter((coin) =>
            coin.name.toLowerCase().includes(search.toLowerCase())
        );

        if (sortKey === "price") {
            result = [...result].sort(
                (a, b) => b.current_price - a.current_price
            );
        }

        if (sortKey === "marketCap") {
            result = [...result].sort(
                (a, b) => b.market_cap - a.market_cap
            );
        }

        if (sortKey === "change24h") {
            result = [...result].sort(
                (a, b) =>
                    (b.price_change_percentage_24h ?? 0) -
                    (a.price_change_percentage_24h ?? 0)
            );
        }

        return result;
    }, [data, search, sortKey]);


    return (
        <div>
            <h1>Market</h1>

            <div style={{ marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Search coin..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div style={{ marginTop: "8px" }}>
                    <button onClick={() => setSortKey("price")}>Sort by Price</button>
                    <button onClick={() => setSortKey("marketCap")}>
                        Sort by Market Cap
                    </button>
                    <button onClick={() => setSortKey("change24h")}>
                        Sort by 24h %
                    </button>
                </div>
            </div>


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
                    {filteredAndSortedData?.map((coin) => (
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
