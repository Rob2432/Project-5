import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">💰 Crypto Market Dashboard</h1>

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
              <tr key={coin.id}>
                <td>{coin.market_cap_rank}</td>
                <td>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="coin-logo"
                  />{" "}
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
