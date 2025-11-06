import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false"
        );
        const data = await response.json();
        setCoins(data);
        setFilteredCoins(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    handleFilterAndSearch();
  }, [searchQuery, filterCategory]);

  const handleFilterAndSearch = () => {
    let results = [...coins];

    if (filterCategory === "top100") {
      results = results.filter((coin) => coin.market_cap_rank <= 100);
    } else if (filterCategory === "mid") {
      results = results.filter(
        (coin) => coin.market_cap_rank > 100 && coin.market_cap_rank <= 500
      );
    } else if (filterCategory === "low") {
      results = results.filter((coin) => coin.market_cap_rank > 500);
    }

    if (searchQuery.trim() !== "") {
      results = results.filter((coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCoins(results);
  };

  const totalCoins = filteredCoins.length;
  const avgPrice =
    filteredCoins.length > 0
      ? (
          filteredCoins.reduce((sum, coin) => sum + coin.current_price, 0) /
          filteredCoins.length
        ).toFixed(2)
      : 0;
  const highestMarketCap =
    filteredCoins.length > 0
      ? Math.max(...filteredCoins.map((coin) => coin.market_cap)).toLocaleString()
      : 0;

  if (loading) return <div className="dashboard-loading">Loading data...</div>;

  // --- Chart Data ---

  // 1️⃣ Top 10 coins by market cap (Bar Chart)
  const top10MarketCap = [...filteredCoins]
    .sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, 10)
    .map((coin) => ({
      name: coin.symbol.toUpperCase(),
      marketCap: coin.market_cap,
    }));

  const COLORS = [
    "#00ffcc",
    "#00e6b8",
    "#00d4a6",
    "#00c2a3",
    "#00b290",
    "#009f7d",
    "#008d6a",
    "#007b57",
    "#006944",
    "#005832",
  ];

  // 2️⃣ Pie chart: Top 5 coins vs rest
  const totalMarketCap = filteredCoins.reduce(
    (sum, coin) => sum + coin.market_cap,
    0
  );
  const top5Coins = [...filteredCoins]
    .sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, 5)
    .map((coin) => ({
      name: coin.name,
      value: coin.market_cap,
    }));
  const restValue =
    totalMarketCap - top5Coins.reduce((sum, coin) => sum + coin.value, 0);
  const pieData = [...top5Coins, { name: "Rest of Market", value: restValue }];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">💰 Crypto Market Dashboard</h1>

      {/* --- Summary Cards --- */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>Total Coins</h3>
          <p>{totalCoins}</p>
        </div>
        <div className="summary-card">
          <h3>Average Price (USD)</h3>
          <p>${avgPrice}</p>
        </div>
        <div className="summary-card">
          <h3>Highest Market Cap</h3>
          <p>${highestMarketCap}</p>
        </div>
      </div>

      {/* --- Search & Filter --- */}
      <div className="controls-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Coins</option>
            <option value="top100">Top 100 (Large Cap)</option>
            <option value="mid">Mid Cap (101–500)</option>
            <option value="low">Low Cap (500+)</option>
          </select>
        </div>
      </div>

      {/* --- Charts Section --- */}
      <div
        style={{
          width: "95%",
          margin: "0 auto 40px",
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* Bar Chart: Top 10 Coins by Market Cap */}
        <div
          style={{
            flex: "1 1 400px",
            background: "#121212",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              color: "#00ffcc",
              marginBottom: "10px",
            }}
          >
            Top 10 Coins by Market Cap
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={top10MarketCap}
              margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#00ffcc33" />
              <XAxis dataKey="name" stroke="#00ffcc" />
              <YAxis stroke="#00ffcc" />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Bar dataKey="marketCap" fill="#00ffcc" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Top 5 vs Rest of Market */}
        <div
          style={{
            flex: "1 1 400px",
            background: "#121212",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              color: "#00ffcc",
              marginBottom: "10px",
            }}
          >
            Top 5 Coins vs Rest of Market
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.name}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Coin Table --- */}
      {filteredCoins.length === 0 ? (
        <div className="no-results">No results match your filters 😢</div>
      ) : (
        <table className="coin-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Coin</th>
              <th>Symbol</th>
              <th>Price (USD)</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.slice(0, 50).map((coin) => (
              <tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{coin.market_cap_rank}</td>
                <td>
                  <img src={coin.image} alt={coin.name} className="coin-logo" />{" "}
                  {coin.name}
                </td>
                <td>{coin.symbol.toUpperCase()}</td>
                <td>${coin.current_price.toLocaleString()}</td>
                <td>${coin.market_cap.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
