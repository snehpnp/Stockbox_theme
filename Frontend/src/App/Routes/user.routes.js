import { Routes, Route } from "react-router-dom";

import Dashboard from "../components/Dashboard/DashbaordMain";
import Services from "../Layout/Users/Service/Service";
import Trades from "../Layout/Users/Trades/Trade";   
import Basket from "../Layout/Users/Basket/Basket";                    

export default function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
       <Route path ="/basket" element={<Basket />} />
      <Route path="/trades" element={<Trades />} />
      <Route path="/service" element={<Services />} />
    </Routes>
  );
}
