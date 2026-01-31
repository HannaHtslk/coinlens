import { useGetTopCoinsQuery } from '../api/cryptoApi';

const DashboardPage = () => {
    const { data, isLoading, error } = useGetTopCoinsQuery();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    return (
        <div>
            <h1>Market</h1>
            <ul>
                {data?.map((coin) => (
                    <li key={coin.id}>
                        {coin.name} — ${coin.current_price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;
