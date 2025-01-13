import { Routes, Route } from "react-router-dom";

import Dashboard from "../components/Dashboard/DashbaordMain";
import Services from "../Layout/Users/Service/Service";
import Trades from "../Layout/Users/Trades/Trade";   
import Basket from "../Layout/Users/Basket/Basket";    
import BrokerResponse from "../Layout/Users/BrokerResponse/BrokerResponse";       
import PastPerformance from "../Layout/Users/PastPerformance/PastPerformance";  
import ReferEarn from "../Layout/Users/ReferEarn/Refer";
import Coupon from "../Layout/Users/Coupon/Coupon";

       

export default function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
       <Route path ="/basket" element={<Basket />} />
      <Route path="/trades" element={<Trades />} />
      <Route path="/service" element={<Services />} />
      <Route path="/broker_response" element={ <BrokerResponse/> } />
      <Route path="/past-performance" element={ <PastPerformance/> } />
      <Route path="/refer-earn" element={<ReferEarn />} />
      <Route path="/coupons" element={<Coupon />} />
    </Routes>
  );
}
