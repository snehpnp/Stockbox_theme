import React, { useState, useEffect } from 'react';
import { getstaffperuser } from '../Services/Admin/Admin';
import { Routes, Route } from "react-router-dom";
import Banner from '../Layout/Employee/Banner/Banner';
import Basket from '../Layout/Employee/Basket/Basket';
import AddBasket from '../Layout/Employee/Basket/Addbasket';
import Viewbasketdetail from '../Layout/Employee/Basket/Viewbasketdetail';
import Editbasket from '../Layout/Employee/Basket/Editbasket';
import BasketStockPublish from '../Layout/Employee/Basket/BasketStockPublish';
import BasketPurchaseHistory from '../Layout/Employee/Basket/BasketPurchaseHistory';
import AllBasketHistory from '../Layout/Employee/Basket/AllBasketHistory';
import EditStock from '../Layout/Employee/Basket/EditStock';
import Blogs from '../Layout/Employee/Bloags/Blogs';
import Addblogs from '../Layout/Employee/Bloags/Addblogs';
import Updateblogs from '../Layout/Employee/Bloags/Updateblogs';
import Viewblog from '../Layout/Employee/Bloags/Viewblog';
import Category from '../Layout/Employee/Category/Category';
import Coupon from '../Layout/Employee/Coupon/Coupon';
import Addcoupon from '../Layout/Employee/Coupon/Addcoupon';
import Updatecoupon from '../Layout/Employee/Coupon/Updatecoupon';
import Faq from '../Layout/Employee/Faq/Faq';
import News from '../Layout/Employee/News/News';
import Addnews from '../Layout/Employee/News/Addnews';
import Updatenews from '../Layout/Employee/News/Updatenews';
import History from '../Layout/Employee/Payment_history/Paymenthistory';
import PaymentRequest from '../Layout/Employee/PaymentRequest/PaymentRequest';
import Perform from '../Layout/Employee/Perform/Perfom';
import Planexpiry from '../Layout/Employee/PlanExpiry/Planexpiry';
import Plan from '../Layout/Employee/Plans/Plan';
import Addplan from '../Layout/Employee/Plans/Addplan';
import Editplan from '../Layout/Employee/Plans/Editplan';
import Signal from '../Layout/Employee/Signal/Signal';
import AddSignal from '../Layout/Employee/Signal/AddSignal';
import Signaldetail from '../Layout/Employee/Signal/Signaldetail';
import Closesignal from '../Layout/Employee/Signal/Closesignal';
import Client from '../Layout/Employee/StaffClient/Client';
import EditClient from '../Layout/Employee/StaffClient/Editclient';
import Viewclientdetail from '../Layout/Employee/StaffClient/Viewclient';
import Freeclient from '../Layout/Employee/StaffClient/Freeclient';
import Editfreeclient from '../Layout/Employee/StaffClient/Editfreeclient';
import AddClient from '../Layout/Employee/StaffClient/Addclient';
import AddStock from '../Layout/Employee/Basket/AddStock';
import Dashbord from '../Layout/Admin/Admin_dashboard/Dashboard';



export default function Employee() {


    const token = localStorage.getItem('token');


    const userid = localStorage.getItem('id');

    const [permission, setPermission] = useState([]);

    const [isToggled, setIsToggled] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);


    useEffect(() => {
        getpermissioninfo()
    }, [])



    useEffect(() => {

        if (!isToggled) {
            setIsSidebarHovered(false);
        }
    }, [isToggled]);

    const handleMouseEnter = () => {
        if (isToggled) {
            setIsSidebarHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (isToggled) {
            setIsSidebarHovered(false);
        }
    };

    const handleToggleClick = () => {
        setIsToggled((prevState) => !prevState);
    };


    const getpermissioninfo = async () => {
        try {
            const response = await getstaffperuser(userid, token);
            if (response.status) {
                setPermission(response.data.permissions);
            }
        } catch (error) {
            console.log("Error", error);
        }
    };



    return (
        <Routes>
            <Route path="/dashboard" element={<Dashbord />} />
            {permission.includes("viewbanner") ? <Route path="/banner" element={<Banner />} /> : ""}

            {permission.includes("vewbasket") ? <Route path="/basket" element={<Basket />} /> : ""}
            {permission.includes("addbasket") ? <Route path="/addbasket" element={<AddBasket />} /> : ""}
            {permission.includes("basketdetail") ? <Route path="/viewdetail/:id" element={<Viewbasketdetail />} /> : ""}
            {permission.includes("editbasket") ? <Route path="/basket/editbasket/:id" element={<Editbasket />} /> : ""}
            {permission.includes("vewbasket") ? <Route path="/basket/basketstockpublish" element={<BasketStockPublish />} /> : ""}
            {permission.includes("Subscriptionhistory") ? <Route path="/basket-purchase-history/:id" element={<BasketPurchaseHistory />} /> : ""}
            {permission.includes("allbaskethistory") ? <Route path="/purchasebaskethistory" element={<AllBasketHistory />} /> : ""}
            {permission.includes("addstock") ? <Route path="/addstock/:id" element={<AddStock />} /> : ""}
            {permission.includes("editstock") ? <Route path="/editstock/:id" element={<EditStock />} /> : ""}

            {permission.includes("viewblogs") ? <Route path="/blogs" element={<Blogs />} /> : ""}
            {permission.includes("addblogs") ? <Route path="/addblogs" element={<Addblogs />} /> : ""}
            {permission.includes("editblogs") ? <Route path="/updatebolgs" element={<Updateblogs />} /> : ""}
            {permission.includes("blogdetail") ? <Route path="/viewblog" element={<Viewblog />} /> : ""}


            {permission.includes("viewcategory") ? <Route path="/category" element={<Category />} /> : ""}

            {permission.includes("viewcoupon") ? <Route path="/coupon" element={<Coupon />} /> : ""}
            {permission.includes("addcoupon") ? <Route path="/addcoupon" element={<Addcoupon />} /> : ""}
            {permission.includes("editcoupon") ? <Route path="/coupon/updatecoupon/:id" element={<Updatecoupon />} /> : ""}


            {permission.includes("viewfaq") ? <Route path="/faq" element={<Faq />} /> : ""}


            {permission.includes("viewnews") ? <Route path="/news" element={<News />} /> : ""}
            {permission.includes("addnews") ? <Route path="/addnews" element={<Addnews />} /> : ""}
            {permission.includes("editnews") ? <Route path="/updatenews" element={<Updatenews />} /> : ""}

            {permission.includes("paymenthistory") ? <Route path="/paymenthistory" element={<History />} /> : ""}
            {permission.includes("planexpiry") ? <Route path="/planexpiry" element={<Planexpiry />} /> : ""}
            <Route path="/paymentrequest" element={<PaymentRequest />} />
            {permission.includes("perform") ? <Route path="/perform" element={<Perform />} /> : ""}


            {permission.includes("viewplan") ? <Route path="/plan" element={<Plan />} /> : ""}
            {permission.includes("addplan") ? <Route path="/addplan" element={<Addplan />} /> : ""}
            {permission.includes("editplan") ? <Route path="/plan/editplan/:id" element={<Editplan />} /> : ""}


            {permission.includes("viewsignal") ? <Route path="/signal" element={<Signal />} /> : ""}
            {permission.includes("addsignal") ? <Route path="/addsignal" element={<AddSignal />} /> : ""}
            {permission.includes("signaldetail") ? <Route path="/signaldetaile/:id" element={<Signaldetail />} /> : ""}
            {permission.includes("viewsignal") ? <Route path="/closesignal" element={<Closesignal />} /> : ""}


            {permission.includes("viewclient") ? <Route path="/client" element={<Client />} /> : ""}
            {permission.includes("addclient") ? <Route path="/addclient" element={<AddClient />} /> : ""}
            {permission.includes("editclient") ? <Route path="/client/updateclient/:id" element={<EditClient />} /> : ""}
            {permission.includes("viewdetail") ? <Route path="/client/clientdetail/:id" element={<Viewclientdetail />} /> : ""}
            {permission.includes("viewfreeclient") ? <Route path="/freeclient" element={<Freeclient />} /> : ""}
            {permission.includes("editfreeclient") ? <Route path="/editfreeclient/:id" element={<Editfreeclient />} /> : ""}






        </Routes>
    );
}
