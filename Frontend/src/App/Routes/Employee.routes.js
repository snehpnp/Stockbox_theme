import React, { useState, useEffect } from 'react';
import { AddStock, getstaffperuser } from '../Services/Admin/Admin';
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
            console.log("error", error);
        }
    };



    return (
        <Routes>
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



        </Routes>
    );
}
