import { Routes, Route } from "react-router-dom";

import Dashboard from "../components/Dashboard/DashbaordMain";
import Services from "../Layout/Users/Service/Service";
import Trades from "../Layout/Users/Trades/Trade";

export default function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/service" element={<Services />} />
      <Route path="/trades" element={<Trades />} />
    </Routes>
  );
}
