import { Routes, Route } from "react-router-dom";

import Dashboard from "../components/Dashboard/DashbaordMain";
import Services from "../Layout/Users/Service/Service";
import Trades from "../Layout/Users/Trades/Trade";   
import Basket from "../Layout/Users/Basket/Basket";    
import BrokerResponse from "../Layout/Users/BrokerResponse/BrokerResponse";       
import PastPerformance from "../Layout/Users/PastPerformance/PastPerformance";  
import ReferEarn from "../Layout/Users/ReferEarn/Refer";
import Coupon from "../Layout/Users/Coupon/Coupon";
import Faq from "../Layout/Users/Faq/Faq";
import PaymentHistory from "../Layout/Users/PaymentHistory/PaymentHistory";
import Subscription from "../Layout/Users/Subscription/Subscription";
import Privacy from "../Layout/Users/Privacy/Privacy";

       

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
      <Route path="/faq" element={<Faq />} />
      <Route path="/payment-history" element={<PaymentHistory />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/privacy-policy" element={<Privacy />} />
    </Routes>
  );
}
