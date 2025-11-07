import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "./Dashboard.css";

// ✅ Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch data
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

  // Update filter + search
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

  if (loading) return <div className="dashboard-loading">Loading data...</div>;

  // --- Chart Data ---
  const top10MarketCap = [...filteredCoins]
    .sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, 10);

  const top10BarData = {
    labels: top10MarketCap.map((coin) => coin.name),
    datasets: [
      {
        label: "Market Cap (USD)",
        data: top10MarketCap.map((coin) => coin.market_cap),
        backgroundColor: "rgba(0, 255, 204, 0.6)",
        borderColor: "#00ffcc",
        borderWidth: 1,
      },
    ],
  };

  const top10BarOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#00ffcc" },
      },
      title: {
        display: true,
        text: "Top 10 Coins by Market Cap",
        color: "#00ffcc",
      },
    },
    scales: {
      x: {
        ticks: { color: "#00ffcc" },
        grid: { color: "#00ffcc33" },
      },
      y: {
        ticks: { color: "#00ffcc" },
        grid: { color: "#00ffcc33" },
      },
    },
  };

  // Pie Chart: Top 5 coins vs Rest
  const totalMarketCap = filteredCoins.reduce(
    (sum, coin) => sum + coin.market_cap,
    0
  );
  const top5Coins = [...filteredCoins]
    .sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, 5);

  const restMarketCap =
    totalMarketCap -
    top5Coins.reduce((sum, coin) => sum + coin.market_cap, 0);

  const pieData = {
    labels: [...top5Coins.map((coin) => coin.name), "Rest of Market"],
    datasets: [
      {
        label: "Market Share",
        data: [...top5Coins.map((coin) => coin.market_cap), restMarketCap],
        backgroundColor: [
          "#00ffcc",
          "#00e6b8",
          "#00d4a6",
          "#00c2a3",
          "#00b290",
          "#008d6a",
        ],
        borderColor: "#121212",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: { color: "#00ffcc" },
      },
      title: {
        display: true,
        text: "Top 5 Coins vs Rest of Market",
        color: "#00ffcc",
      },
    },
  };

  // --- Summary Stats ---
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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">💰 Crypto Market Dashboard</h1>

      {/* --- Summary Section --- */}
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

      {/* --- Controls --- */}
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

      {/* --- Charts --- */}
      <div
        style={{
          width: "95%",
          margin: "0 auto 40px",
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            flex: "1 1 400px",
            background: "#121212",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <Bar data={top10BarData} options={top10BarOptions} />
        </div>

        <div
          style={{
            flex: "1 1 400px",
            background: "#121212",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <Pie data={pieData} options={pieOptions} />
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
