import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Dashboard.css"; // reuse same theme

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const data = await response.json();
        setCoin(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };
    fetchCoin();
  }, [id]);

  if (loading) return <div className="dashboard-loading">Loading details...</div>;
  if (!coin) return <div className="no-results">Coin not found 😢</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">{coin.name} Details</h1>

      <div className="summary-section">
        <div className="summary-card">
          <h3>Current Price</h3>
          <p>${coin.market_data.current_price.usd.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Market Cap</h3>
          <p>${coin.market_data.market_cap.usd.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>24h High / Low</h3>
          <p>
            ${coin.market_data.high_24h.usd.toLocaleString()} / $
            {coin.market_data.low_24h.usd.toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <img
          src={coin.image.large}
          alt={coin.name}
          style={{ width: "100px", height: "100px" }}
        />
        <p style={{ maxWidth: "800px", margin: "20px auto", lineHeight: "1.6" }}>
          {coin.description.en
            ? coin.description.en.split(". ")[0] + "."
            : "No description available."}
        </p>
        {coin.links.homepage[0] && (
          <p>
            🔗 <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer" style={{ color: "#00ffcc" }}>
              Official Website
            </a>
          </p>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Link to="/" style={{ color: "#00ffcc", textDecoration: "none" }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default CoinDetail;
