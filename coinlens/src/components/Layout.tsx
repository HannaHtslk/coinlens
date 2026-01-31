import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <nav style={{ padding: "16px", borderBottom: "1px solid #ccc" }}>
                <Link to="/dashboard">Dashboard</Link>{" | "}
                <Link to="/portfolio">Portfolio</Link>
            </nav>

            <main style={{ padding: "16px" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
