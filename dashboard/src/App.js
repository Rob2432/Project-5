import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import CoinDetail from "./Components/CoinDetail";
import Sidebar from "./Components/Sidebar";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
