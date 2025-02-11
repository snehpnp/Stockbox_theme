import { Routes, Route } from "react-router-dom";



import Theme from "../Layout/Superadmin/Themes/Theme";
import AddTheme from "../Layout/Superadmin/Themes/AddTheme";
import Edittheme from "../Layout/Superadmin/Themes/EditTheme";
import Company from "../Layout/Superadmin/Company/Company";
import Dashbord from "../Layout/Admin/Admin_dashboard/Dashboard";
import Basket from "../Layout/Admin/Admin_basket/Basket";
import AddBasket from "../Layout/Admin/Admin_basket/Addbasket";
import Viewbasketdetail from "../Layout/Admin/Admin_basket/Viewbasketdetail";
import Editbasket from "../Layout/Admin/Admin_basket/Editbasket";
import AddStock from "../Layout/Admin/Admin_basket/AddStock";
import BasketStockPublish from "../Layout/Admin/Admin_basket/BasketStockPublish";
import BasketPurchaseHistory from "../Layout/Admin/Admin_basket/BasketPurchaseHistory";
import AllBasketHistory from "../Layout/Admin/Admin_basket/AllBasketHistory";
import EditStock from "../Layout/Admin/Admin_basket/EditStock";
import Client from "../Layout/Admin/Admin_client/Client";
import Freeclient from "../Layout/Admin/Admin_client/Freeclient";
import AddUser from "../Layout/Admin/Admin_client/AddUser";
import EditClient from "../Layout/Admin/Admin_client/EditClient";
import Viewclientdetail from "../Layout/Admin/Admin_client/Viewclient";
import Editfreeclient from "../Layout/Admin/Admin_client/Editfreeclient";
import ClientDeleteHistory from "../Layout/Admin/Admin_client/ClientDeleteHistory";
import ClientSignaldetail from "../Layout/Admin/Admin_client/ClientSignaldetail";
import ClientRequest from "../Layout/Admin/Admin_client/ClientRequest/ClientRequest";
import Faq from "../Layout/Admin/Admin_faq/Faq";
import Kyc from "../Layout/Admin/Admin_kyc/Kyc";
import Perform from "../Layout/Admin/Admin_perfom/Perfom";
import Service from "../Layout/Admin/Admin_service/Service.s";
import Banner from "../Layout/Admin/Banner/Banner";
import Blogs from "../Layout/Admin/Bloags/Blogs";
import Addblogs from "../Layout/Admin/Bloags/Addblogs";
import Updateblogs from "../Layout/Admin/Bloags/Updateblogs";
import Viewblog from "../Layout/Admin/Bloags/Viewblog";
import Category from "../Layout/Admin/Category/Category";
import Profile from "../Layout/Admin/Admin_profile/Profile";
import Signal from "../Layout/Admin/Admin_signal/Signal";
import AddSignal from "../Layout/Admin/Admin_signal/AddSignal";
import Signaldetail from "../Layout/Admin/Admin_signal/Signaldetail";
import Closesignal from "../Layout/Admin/Admin_signal/Closesignal";
import Staff from "../Layout/Admin/Admin_staff/Staff";
import AddStaff from "../Layout/Admin/Admin_staff/AddStaff";
import Update from "../Layout/Admin/Admin_staff/Update";
import Staffpermission from "../Layout/Admin/Admin_staff/Staffpermission";
import Generalsettings from "../Layout/Admin/BasicSetting/Generalsettings";
// import Apiinfo from "../Layout/Admin/BasicSetting/Apiinfo";
import Payementgateway from "../Layout/Admin/BasicSetting/Payementgateway";
import Emailsettings from "../Layout/Admin/BasicSetting/Emailsettings";
import Emailtemplate from "../Layout/Admin/BasicSetting/Emailtemplate";
import ReferAndEarn from "../Layout/Admin/BasicSetting/ReferAndEarn";
import Autosquareoff from "../Layout/Admin/BasicSetting/Autosquareoff";
import Bankdetail from "../Layout/Admin/BasicSetting/BankDetaildata/Bankdetail";
import Addbankdetail from "../Layout/Admin/BasicSetting/BankDetaildata/Addbankdetail";
import Updatebankdetail from "../Layout/Admin/BasicSetting/BankDetaildata/Updatebankdetail";
import QRDetails from "../Layout/Admin/BasicSetting/QRDetails/QRDetails";
import Help from "../Layout/Admin/Help_center/Help";
import PaymentRequest from "../Layout/Admin/PaymentRequest/PaymentRequest";
import FreetrialStatus from "../Layout/Admin/Freetrialstatus/FreetrialStatus";
import Message from "../Layout/Admin/Broadcast/Message";
import Addbroadcast from "../Layout/Admin/Broadcast/Addbroadcast";
import Updatebroadcast from "../Layout/Admin/Broadcast/Updatebroadcast";
import Planexpiry from "../Layout/Admin/PlanExpiry/Planexpiry";
import Planexpirymonth from "../Layout/Admin/PlanExpiryMonth/Planexpirymonth";
import Notificationlist from "../Layout/Admin/Notification/Notificationlist";
import Stock from "../Layout/Admin/Stock/Stock";
import Plan from "../Layout/Admin/Plans/Plan";
import Addplan from "../Layout/Admin/Plans/Addplan";
import Editplan from "../Layout/Admin/Plans/Editplan";
import News from "../Layout/Admin/News/News";
import Addnews from "../Layout/Admin/News/Addnews";
import Updatenews from "../Layout/Admin/News/Updatenews";
import Condition from "../Layout/Admin/Termscondition/Condition";
import Updatecondition from "../Layout/Admin/Termscondition/Updatecondition";
import PaymentHistory from "../Layout/Admin/Payment_history/Paymenthistory"

import Coupon from "../Layout/Admin/Coupon/Coupon";
import Addcoupon from "../Layout/Admin/Coupon/Addcoupon";
import Updatecoupon from "../Layout/Admin/Coupon/Updatecoupon";
import Apiinfo from "../Layout/Admin/BasicSetting/Apiinfo";
import ClientOrderlist from "../Layout/Admin/ClientOrderlist/ClientOrderlist";




export default function App() {

  return (
    <Routes>
      <Route path="/themes" element={<Theme />} />
      <Route path="/add-theme" element={<AddTheme />} />
      <Route path="/edit-theme/:id" element={<Edittheme />} />
      <Route path="/dashboard" element={<Dashbord />} />
      <Route path="/company" element={<Company />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/basket" element={<Basket />} />
      <Route path="/addbasket" element={<AddBasket />} />
      <Route path="/viewdetail/:id" element={<Viewbasketdetail />} />
      <Route path="/basket/editbasket/:id" element={<Editbasket />} />
      <Route path="/addstock/:id" element={<AddStock />} />
      <Route path="/basket/basketstockpublish" element={<BasketStockPublish />} />
      <Route path="/basket-purchase-history/:id" element={<BasketPurchaseHistory />} />
      <Route path="/purchasebaskethistory" element={<AllBasketHistory />} />
      <Route path="/editstock/:id" element={<EditStock />} />

      <Route path="/stock" element={<Stock />} />


      <Route path="/client" element={<Client />} />
      <Route path="/freeclient" element={<Freeclient />} />
      <Route path="/addclient" element={<AddUser />} />
      <Route path="/client/updateclient/:id" element={<EditClient />} />
      <Route path="/client/clientdetail/:id" element={<Viewclientdetail />} />
      <Route path="/editfreeclient/:id" element={<Editfreeclient />} />
      <Route path="/clientdeletehistory" element={<ClientDeleteHistory />} />
      <Route path="/clientsignaldetail/:id" element={<ClientSignaldetail />} />
      <Route path="/clientrequest" element={<ClientRequest />} />


      <Route path="/faq" element={<Faq />} />
      <Route path="/paymenthistory" element={<PaymentHistory />} />
      <Route path="/kyc" element={<Kyc />} />
      <Route path="/perfom" element={<Perform />} />
      <Route path="/service" element={<Service />} />
      <Route path="/banner" element={<Banner />} />


      <Route path="/blogs" element={<Blogs />} />
      <Route path="/addblogs" element={<Addblogs />} />
      <Route path="/updatebolgs" element={<Updateblogs />} />
      <Route path="/viewblog" element={<Viewblog />} />

      <Route path="/category" element={<Category />} />



      <Route path="/signal" element={<Signal />} />
      <Route path="/addsignal" element={<AddSignal />} />
      <Route path="/signaldetaile/:id" element={<Signaldetail />} />
      <Route path="/closesignal" element={<Closesignal />} />


      <Route path="/staff" element={<Staff />} />
      <Route path="/addstaff" element={<AddStaff />} />
      <Route path="/staff/updatestaff/:id" element={<Update />} />
      <Route path="/staff/staffpermission/:id" element={<Staffpermission />} />



      <Route path="/generalsettings" element={<Generalsettings />} />
      <Route path="/Apiinfo" element={<Apiinfo />} />
      <Route path="/paymentgeteway" element={<Payementgateway />} />
      <Route path="/emailsetting" element={<Emailsettings />} />
      <Route path="/emailtemplate" element={<Emailtemplate />} />
      <Route path="/referandearn" element={<ReferAndEarn />} />
      <Route path="/autosquareoff" element={<Autosquareoff />} />

      <Route path="/bankdetail" element={<Bankdetail />} />
      <Route path="/addbankdetail" element={<Addbankdetail />} />
      <Route path="/updatebankdetail/:id" element={<Updatebankdetail />} />

      <Route path="/QRdetails" element={<QRDetails />} />


      {/* <Route path="/changepass" element={<Changepass />} /> */}
      <Route path="/help" element={<Help />} />
      <Route path="/paymentrequest" element={<PaymentRequest />} />

      <Route path="/freetrialstatus" element={<FreetrialStatus />} />


      <Route path="/plan" element={<Plan />} />
      <Route path="/addplan" element={<Addplan />} />
      <Route path="/plan/editplan/:id" element={<Editplan />} />




      <Route path="/message" element={<Message />} />
      <Route path="/addbroadcast" element={<Addbroadcast />} />
      <Route path="/updatebroadcast" element={<Updatebroadcast />} />

      <Route path="/planexpiry" element={<Planexpiry />} />
      <Route path="/planexpirymonth" element={<Planexpirymonth />} />
      <Route path="/notificationlist" element={<Notificationlist />} />


      <Route path="/profile" element={<Profile />} />


      <Route path="/news" element={<News />} />
      <Route path="/addnews" element={<Addnews />} />
      <Route path="/updatenews" element={<Updatenews />} />


      <Route path="/coupon" element={<Coupon />} />
      <Route path="/addcoupon" element={<Addcoupon />} />
      <Route path="/coupon/updatecoupon/:id" element={<Updatecoupon />} />

      <Route path="/termsandcondtion" element={<Condition />} />
      <Route path="/updatecondition" element={<Updatecondition />} />

      <Route path="/orderlist" element={<ClientOrderlist />} />

    </Routes>
  );
}
