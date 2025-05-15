import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../../Utils/Loader";

const Dashboard = lazy(() => import("../Layout/Users/Dashboard/Dashboard"));
const Services = lazy(() => import("../Layout/Users/Service/Service"));
const Trades = lazy(() => import("../Layout/Users/Trades/Trade"));
const Basket = lazy(() => import("../Layout/Users/Basket/Basket"));
const PastPerformance = lazy(() => import("../Layout/Users/PastPerformance/PastPerformance"));
const ReferEarn = lazy(() => import("../Layout/Users/ReferEarn/Refer"));
const Coupon = lazy(() => import("../Layout/Users/Coupon/Coupon"));
const Faq = lazy(() => import("../Layout/Users/Faq/Faq"));
const PaymentHistory = lazy(() => import("../Layout/Users/PaymentHistory/PaymentHistory"));
const Subscription = lazy(() => import("../Layout/Users/Subscription/Subscription"));
const Privacy = lazy(() => import("../Layout/Users/Privacy/Privacy"));
const Terms = lazy(() => import("../Layout/Users/TermsCondition/Terms"));
const Profiles = lazy(() => import("../Layout/Users/Profile/Profiles"));
const Demat = lazy(() => import("../Layout/Users/Demat/Demat"));
const Cash = lazy(() => import("../Layout/Users/PastPerformance/Cash"));
const Future = lazy(() => import("../Layout/Users/PastPerformance/Future"));
const Option = lazy(() => import("../Layout/Users/PastPerformance/Option"));
const Userkyc = lazy(() => import("../Layout/Users/Profile/Kyc"));
const HelpDesk = lazy(() => import("../Layout/Users/HelpDesk/HelpDesk"));
const BrokerReponse = lazy(() => import("../Layout/Users/Trades/BrokerReponse"));
const BasketDetail = lazy(() => import("../Layout/Users/Basket/BasketDetail"));
const Notification = lazy(() => import("../Layout/Users/Notification/Notification"));
const Broadcast = lazy(() => import("../Layout/Users/Broadcast/Broadcast"));
const News = lazy(() => import("../Layout/Users/News/News"));
const NewsDetail = lazy(() => import("../Layout/Users/News/NewsDetail"));
const Blogs = lazy(() => import("../Layout/Users/Blogs/Blogs"));
const BasketStockList = lazy(() => import("../Layout/Users/Basket/BasketStockList"));
const RebalanceHistory = lazy(() => import("../Layout/Users/Basket/RebalanceHistory"));
const BasketResponse = lazy(() => import("../Layout/Users/BasketResponse/BasketResponse"));
const Wallet = lazy(() => import("../Layout/Users/Wallet/Wallet"));
const Payments = lazy(() => import("../Layout/Users/Basket/Payments"));
const RebalanceStock = lazy(() => import("../Layout/Users/Basket/RebalanceStock"));

export default function App() {
  return (
    <Suspense fallback={<div><Loader /></div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/service" element={<Services />} />
        <Route path="/past-performance" element={<PastPerformance />} />
        <Route path="/refer-earn" element={<ReferEarn />} />
        <Route path="/coupons" element={<Coupon />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-conditions" element={<Terms />} />
        <Route path="/profile" element={<Profiles />} />
        <Route path="/demat" element={<Demat />} />
        <Route path="/past-performance/cash" element={<Cash />} />
        <Route path="/past-performance/future" element={<Future />} />
        <Route path="/past-performance/option" element={<Option />} />
        <Route path="/kyc" element={<Userkyc />} />
        <Route path="/help-desk" element={<HelpDesk />} />
        <Route path="/broker-response" element={<BrokerReponse />} />
        <Route path="/basketdetail" element={<BasketDetail />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/broadcast" element={<Broadcast />} />
        <Route path="/news" element={<News />} />
        <Route path="/newsdetail" element={<NewsDetail />} />
        <Route path="/basketstocklist" element={<BasketStockList />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/rebalanceHistory/:id" element={<RebalanceHistory />} />
        <Route path="/basket-response" element={<BasketResponse />} />
        <Route path="/rebalancestock/:id" element={<RebalanceStock />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/payment" element={<Payments />} />
      </Routes>
    </Suspense>
  );
}