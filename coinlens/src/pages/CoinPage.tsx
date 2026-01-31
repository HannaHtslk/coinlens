import { useParams } from "react-router-dom";
import { useState } from "react";
import { useGetCoinByIdQuery, useGetCoinMarketChartQuery } from "../api/cryptoApi";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const CoinPage = () => {
    const { id } = useParams<{ id: string }>();
    const [days, setDays] = useState<7 | 30>(7);


    const { data, isLoading, error } = useGetCoinByIdQuery(id!);

    const {
        data: chartData,
        isLoading: isChartLoading,
    } = useGetCoinMarketChartQuery({
        coinId: id!,
        days,
    });


    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading coin</p>;
    if (!data) return null;

    const prices =
        chartData?.prices.map((item: [number, number]) => ({
            time: new Date(item[0]).toLocaleDateString(),
            price: item[1],
        })) ?? [];


    return (
        <>
            <div>
                <h1>{data.name}</h1>

                <p>Symbol: {data.symbol.toUpperCase()}</p>
                <p>Current price: ${data.market_data.current_price.usd}</p>
                <p>Market cap: ${data.market_data.market_cap.usd}</p>
            </div>
            <div style={{ marginTop: "24px" }}>
                <button onClick={() => setDays(7)}>7d</button>
                <button onClick={() => setDays(30)}>30d</button>
            </div>

            <div style={{ width: "100%", height: 300, marginTop: "16px" }}>
                {isChartLoading ? (
                    <p>Loading chart...</p>
                ) : (
                    <ResponsiveContainer>
                        <LineChart data={prices}>
                            <XAxis dataKey="time" hide />
                            <YAxis domain={["auto", "auto"]} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </>

    );
};

export default CoinPage;
