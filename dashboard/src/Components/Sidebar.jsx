import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">CryptoBoard</h2>
      <ul className="sidebar-nav">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">🏠 Dashboard</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
