import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addStaffpermission, getstaffperuser } from '../../../Services/Admin/Admin';
import { Subscript } from 'lucide-react';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';


const Staffpermission = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const [clients, setClients] = useState([]);
    const [data, setData] = useState([]);

    const { id } = useParams()


    useEffect(() => {
        getAdminclient();
    }, []);

    const getAdminclient = async () => {
        try {
            const response = await getstaffperuser(id, token);
            if (response.status) {
                setClients(response.data.permissions);
                setData(response.data);
            }
        } catch (error) {
            console.log("Error fetching client permissions:", error);
        }
    };




    const onSubmit = async (values) => {
        const permissions = Object.keys(values).filter(key => values[key] === true);

        const req = {
            permissions,
            id: id,
        };
        try {
            const response = await addStaffpermission(req, token);
            if (response.status) {
                showCustomAlert("Success", response.message, navigate, '/admin/staff')
            } else {
                showCustomAlert("error", response.message)

            }
        } catch (error) {
            showCustomAlert("error", 'An unexpected error occurred. Please try again later.')

        }
    };

    const formik = useFormik({
        initialValues: {
            FullName: data?.FullName || '',
            UserName: data?.UserName || '',
            Email: data?.Email || '',
            PhoneNo: data?.PhoneNo || '',

            userPermissions: false,
            addclient: false,
            viewclient: false,
            Ownclient: false,
            viewdetail: false,
            editclient: false,
            // deleteclient: false,
            clientchangestatus: false,
            assignPackage: false,

            planpermission: false,
            addplan: false,
            editplan: false,
            viewplan: false,
            deleteplan: false,
            planstatus: false,


            signalstatus: false,
            ownsignal: false,
            // deletesignal: false,
            editsignal: false,
            viewsignal: false,
            signaldetail: false,
            addsignal: false,
            Signalpermission: false,
            Strategy: false,

            // Staffpermission: false,
            // addstaff: false,
            // editstaff: false,
            // viewstaff: false,
            // deletestaff: false,
            // staffstatus: false,

            newspermission: false,
            addnews: false,
            editnews: false,
            viewnews: false,
            deletenews: false,
            newsstatus: false,


            bannerpermission: false,
            addbanner: false,
            editbanner: false,
            viewbanner: false,
            deletebanner: false,
            bannerstatus: false,


            couponpermission: false,
            addcoupon: false,
            editcoupon: false,
            viewcoupon: false,
            coupondetail: false,
            deletecoupon: false,
            couponstatus: false,


            blogspermission: false,
            addblogs: false,
            editblogs: false,
            viewblogs: false,
            blogdetail: false,
            deleteblogs: false,
            blogsstatus: false,



            faqpermission: false,
            addfaq: false,
            editfaq: false,
            viewfaq: false,
            deletefaq: false,
            faqstatus: false,


            categorypermission: false,
            addcategory: false,
            editcategory: false,
            viewcategory: false,
            // deletecategory: false,
            categorystatus: false,


            freeclientpermission: false,
            addfreeclient: false,
            editfreeclient: false,
            viewfreeclient: false,
            freeclientstatus: false,

            otherpermission: false,
            paymenthistory: false,
            planexpiry: false,
            perform: false,
            broadcast: false,
            ticket: false,



            basketpermission: false,
            addbasket: false,
            editbasket: false,
            deletebasket: false,
            basketActivestatus: false,
            Rebalancestatus: false,
            publishstock: false,
            Rebalancebutton: false,
            Subscriptionhistory: false,
            vewbasket: false,
            basketdetail: false,
            addstock: false,
            editstock: false,
            allbaskethistory: false,





        },
        onSubmit,
    });

    useEffect(() => {
        if (clients.length > 0) {
            formik.setFieldValue('addclient', clients.includes('addclient'));
            formik.setFieldValue('viewclient', clients.includes('viewclient'));
            formik.setFieldValue('Ownclient', clients.includes('Ownclient'));
            formik.setFieldValue('viewdetail', clients.includes('viewdetail'));
            formik.setFieldValue('editclient', clients.includes('editclient'));
            // formik.setFieldValue('deleteclient', clients.includes('deleteclient'));
            formik.setFieldValue('clientchangestatus', clients.includes('clientchangestatus'));
            formik.setFieldValue('assignPackage', clients.includes('assignPackage'));
            formik.setFieldValue('userPermissions', clients.includes('userPermissions'));



            formik.setFieldValue('planpermission', clients.includes('planpermission'));
            formik.setFieldValue('addplan', clients.includes('addplan'));
            formik.setFieldValue('editplan', clients.includes('editplan'));
            // formik.setFieldValue('deleteplan', clients.includes('deleteplan'));
            formik.setFieldValue('planstatus', clients.includes('planstatus'));
            formik.setFieldValue('viewplan', clients.includes('viewplan'));


            formik.setFieldValue('Signalpermission', clients.includes('Signalpermission'));
            formik.setFieldValue('addsignal', clients.includes('addsignal'));
            formik.setFieldValue('editsignal', clients.includes('editsignal'));
            formik.setFieldValue('viewsignal', clients.includes('viewsignal'));
            formik.setFieldValue('signaldetail', clients.includes('signaldetail'));
            // formik.setFieldValue('deletesignal', clients.includes('deletesignal'));
            formik.setFieldValue('signalstatus', clients.includes('signalstatus'));
            formik.setFieldValue('ownsignal', clients.includes('ownsignal'));
            formik.setFieldValue('Strategy', clients.includes('Strategy'));



            // formik.setFieldValue('Staffpermission', clients.includes('Staffpermission'));
            // formik.setFieldValue('addstaff', clients.includes('addstaff'));
            // formik.setFieldValue('editstaff', clients.includes('editstaff'));
            // formik.setFieldValue('viewstaff', clients.includes('viewstaff'));
            // // formik.setFieldValue('deletestaff', clients.includes('deletestaff'));
            // formik.setFieldValue('staffstatus', clients.includes('staffstatus'));



            formik.setFieldValue('newspermission', clients.includes('newspermission'));
            formik.setFieldValue('addnews', clients.includes('addnews'));
            formik.setFieldValue('editnews', clients.includes('editnews'));
            formik.setFieldValue('viewnews', clients.includes('viewnews'));
            formik.setFieldValue('deletenews', clients.includes('deletenews'));
            formik.setFieldValue('newsstatus', clients.includes('newsstatus'));



            formik.setFieldValue('bannerpermission', clients.includes('bannerpermission'));
            formik.setFieldValue('addbanner', clients.includes('addbanner'));
            formik.setFieldValue('editbanner', clients.includes('editbanner'));
            formik.setFieldValue('viewbanner', clients.includes('viewbanner'));
            formik.setFieldValue('deletebanner', clients.includes('deletebanner'));
            formik.setFieldValue('bannerstatus', clients.includes('bannerstatus'));



            formik.setFieldValue('couponpermission', clients.includes('couponpermission'));
            formik.setFieldValue('addcoupon', clients.includes('addcoupon'));
            formik.setFieldValue('editcoupon', clients.includes('editcoupon'));
            formik.setFieldValue('viewcoupon', clients.includes('viewcoupon'));
            formik.setFieldValue('coupondetail', clients.includes('coupondetail'));
            formik.setFieldValue('deletecoupon', clients.includes('deletecoupon'));
            formik.setFieldValue('couponstatus', clients.includes('couponstatus'));


            formik.setFieldValue('blogspermission', clients.includes('blogspermission'));
            formik.setFieldValue('addblogs', clients.includes('addblogs'));
            formik.setFieldValue('editblogs', clients.includes('editblogs'));
            formik.setFieldValue('viewblogs', clients.includes('viewblogs'));
            formik.setFieldValue('blogdetail', clients.includes('blogdetail'));
            formik.setFieldValue('deleteblogs', clients.includes('deleteblogs'));
            formik.setFieldValue('blogsstatus', clients.includes('blogsstatus'));


            formik.setFieldValue('faqpermission', clients.includes('faqpermission'));
            formik.setFieldValue('addfaq', clients.includes('addfaq'));
            formik.setFieldValue('editfaq', clients.includes('editfaq'));
            formik.setFieldValue('viewfaq', clients.includes('viewfaq'));
            formik.setFieldValue('deletefaq', clients.includes('deletefaq'));
            formik.setFieldValue('faqstatus', clients.includes('faqstatus'));


            formik.setFieldValue('categorypermission', clients.includes('categorypermission'));
            formik.setFieldValue('addcategory', clients.includes('addcategory'));
            formik.setFieldValue('editcategory', clients.includes('editcategory'));
            formik.setFieldValue('viewcategory', clients.includes('viewcategory'));
            // formik.setFieldValue('deletecategory', clients.includes('deletecategory'));
            formik.setFieldValue('categorystatus', clients.includes('categorystatus'));


            formik.setFieldValue('freeclientpermission', clients.includes('freeclientpermission'));
            formik.setFieldValue('addfreeclient', clients.includes('addfreeclient'));
            formik.setFieldValue('editfreeclient', clients.includes('editfreeclient'));
            formik.setFieldValue('viewfreeclient', clients.includes('viewfreeclient'));
            formik.setFieldValue('freeclientstatus', clients.includes('freeclientstatus'));


            formik.setFieldValue('otherpermission', clients.includes('otherpermission'));
            formik.setFieldValue('paymenthistory', clients.includes('paymenthistory'));
            formik.setFieldValue('planexpiry', clients.includes('planexpiry'));
            formik.setFieldValue('perform', clients.includes('perform'));
            formik.setFieldValue('broadcast', clients.includes('broadcast'));
            formik.setFieldValue('ticket', clients.includes('ticket'));



            formik.setFieldValue('basketpermission', clients.includes('basketpermission'));
            formik.setFieldValue('addbasket', clients.includes('addbasket'));
            formik.setFieldValue('editbasket', clients.includes('editbasket'));
            formik.setFieldValue('deletebasket', clients.includes('deletebasket'));
            formik.setFieldValue('basketActivestatus', clients.includes('basketActivestatus'));
            formik.setFieldValue('Rebalancestatus', clients.includes('Rebalancestatus'));
            formik.setFieldValue('publishstock', clients.includes('publishstock'));
            formik.setFieldValue('Rebalancebutton', clients.includes('Rebalancebutton'));
            formik.setFieldValue('Subscriptionhistory', clients.includes('Subscriptionhistory'));
            formik.setFieldValue('vewbasket', clients.includes('vewbasket'));
            formik.setFieldValue('basketdetail', clients.includes('basketdetail'));
            formik.setFieldValue('editstock', clients.includes('editstock'));
            formik.setFieldValue('addstock', clients.includes('addstock'));
            formik.setFieldValue('allbaskethistory', clients.includes('allbaskethistory'));


        }
    }, [clients]);



    useEffect(() => {
        if (formik.values.userPermissions == true) {
            formik.setFieldValue('addclient', true);
            formik.setFieldValue('viewclient', true);
            formik.setFieldValue('Ownclient', false);
            formik.setFieldValue('viewdetail', true);
            formik.setFieldValue('editclient', true);
            // formik.setFieldValue('deleteclient', true);
            formik.setFieldValue('clientchangestatus', true);
            formik.setFieldValue('assignPackage', true);
        }
        else {
            formik.setFieldValue('addclient', false);
            formik.setFieldValue('viewclient', false);
            // formik.setFieldValue('Ownclient', true);
            formik.setFieldValue('viewdetail', false);
            formik.setFieldValue('editclient', false);
            // formik.setFieldValue('deleteclient', false);
            formik.setFieldValue('clientchangestatus', false);
            formik.setFieldValue('assignPackage', false);
        }

    }, [formik.values.userPermissions])





    // useEffect(() => {
    //     if (formik.values.addclient || formik.values.editclient || formik.values.clientchangestatus || formik.values.assignPackage || formik.values.Ownclient) {
    //         formik.setFieldValue('viewclient', true);
    //     }
    // }, [formik.values.addclient, formik.values.editclient, formik.values.clientchangestatus, formik.values.assignPackage, formik.values.Ownclient]);









    useEffect(() => {
        const permissions = ["addclient", "viewclient", "viewdetail", "editclient", "clientchangestatus", "assignPackage"];

        if (formik.values.userPermissions) {
            permissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {
            // const anyPermissionChecked = permissions.some(permission => formik.values[permission]);

            // if (!anyPermissionChecked) {

            permissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.userPermissions]);




    useEffect(() => {
        const anyPermissionChecked =
            formik.values.addclient ||
            formik.values.editclient ||
            formik.values.clientchangestatus ||
            formik.values.assignPackage ||
            formik.values.Ownclient ||
            formik.values.viewdetail;

        if (anyPermissionChecked) {
            formik.setFieldValue('viewclient', true);
        }

        const allPermissionsChecked =
            formik.values.addclient &&
            formik.values.editclient &&
            formik.values.viewdetail &&
            formik.values.clientchangestatus &&
            formik.values.assignPackage;

        formik.setFieldValue('userPermissions', allPermissionsChecked);
    }, [
        formik.values.addclient,
        formik.values.editclient,
        formik.values.clientchangestatus,
        formik.values.assignPackage,
        formik.values.Ownclient,
        formik.values.viewdetail
    ]);



    useEffect(() => {
        const signalPermissions = ["signalstatus", "viewsignal", "signaldetail", "addsignal", "editsignal", "Strategy"];

        if (formik.values.Signalpermission) {
            signalPermissions.forEach(permission => formik.setFieldValue(permission, true));
            formik.setFieldValue("ownsignal", false);
        } else {
            // const anySignalChecked = signalPermissions.some(permission => formik.values[permission]);

            // if (!anySignalChecked) {
            signalPermissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.Signalpermission]);



    useEffect(() => {
        const anySignalChecked =
            formik.values.signalstatus ||
            formik.values.ownsignal ||
            formik.values.signaldetail ||
            formik.values.addsignal ||
            formik.values.editsignal ||
            formik.values.Strategy

        if (anySignalChecked) {
            formik.setFieldValue("viewsignal", true);
        }


        const allSignalPermissionsChecked =
            formik.values.signalstatus &&
            formik.values.signaldetail &&
            formik.values.addsignal &&
            formik.values.editsignal &&
            formik.values.Strategy

        formik.setFieldValue("Signalpermission", allSignalPermissionsChecked);
    }, [
        formik.values.signalstatus,
        formik.values.ownsignal,
        formik.values.signaldetail,
        formik.values.addsignal,
        formik.values.editsignal,
        formik.values.Strategy,
    ]);


    useEffect(() => {
        const categoryPermissions = ["categorystatus", "viewcategory", "addcategory", "editcategory"];

        if (formik.values.categorypermission) {
            categoryPermissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {
            // const anyCategoryChecked = categoryPermissions.some(permission => formik.values[permission]);

            // if (!anyCategoryChecked) {
            categoryPermissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.categorypermission]);



    useEffect(() => {
        const anyCategoryChecked =
            formik.values.categorystatus ||
            formik.values.addcategory ||
            formik.values.editcategory;

        if (anyCategoryChecked) {
            formik.setFieldValue("viewcategory", true);
        }



        const allCategoryPermissionsChecked =
            formik.values.categorystatus &&
            formik.values.addcategory &&
            formik.values.editcategory;

        formik.setFieldValue("categorypermission", allCategoryPermissionsChecked);
    }, [
        formik.values.categorystatus,
        formik.values.addcategory,
        formik.values.editcategory,
    ]);



    useEffect(() => {
        const planPermissions = ["addplan", "editplan", "viewplan", "planstatus"];

        if (formik.values.planpermission) {
            planPermissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {
            // const anyPlanChecked = planPermissions.some(permission => formik.values[permission]);

            // if (anyPlanChecked) {
            planPermissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.planpermission]);


    useEffect(() => {
        const anyPlanChecked =
            formik.values.addplan ||
            formik.values.editplan ||
            formik.values.planstatus;

        if (anyPlanChecked) {
            formik.setFieldValue("viewplan", true);
        }


        const allPlanPermissionsChecked =
            formik.values.addplan &&
            formik.values.editplan &&
            formik.values.planstatus;

        formik.setFieldValue("planpermission", allPlanPermissionsChecked);
    }, [
        formik.values.addplan,
        formik.values.editplan,
        formik.values.planstatus,
    ]);





    // useEffect(() => {
    //     if (formik.values.Staffpermission == true) {
    //         formik.setFieldValue('addstaff', true);
    //         formik.setFieldValue('editstaff', true);
    //         formik.setFieldValue('viewstaff', true);
    //         // formik.setFieldValue('deletestaff', true);
    //         formik.setFieldValue('staffstatus', true);

    //     }
    //     else {
    //         formik.setFieldValue('addstaff', false);
    //         formik.setFieldValue('editstaff', false);
    //         formik.setFieldValue('viewstaff', false);
    //         // formik.setFieldValue('deletestaff', false);
    //         formik.setFieldValue('staffstatus', false);

    //     }

    // }, [formik.values.Staffpermission]) 


    // useEffect(() => {
    //     if (formik.values.addstaff || formik.values.editstaff || formik.values.staffstatus) {
    //         formik.setFieldValue('viewstaff', true);
    //     }
    // }, [formik.values.addstaff, formik.values.editstaff, formik.values.staffstatus]);



    useEffect(() => {
        const bannerPermissions = ["addbanner", "editbanner", "viewbanner", "deletebanner", "bannerstatus"];

        if (formik.values.bannerpermission) {

            bannerPermissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {

            // const anyBannerChecked = bannerPermissions.some(permission => formik.values[permission]);

            // if (!anyBannerChecked) {
            bannerPermissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.bannerpermission]);


    useEffect(() => {
        const anyBannerChecked =
            formik.values.addbanner ||
            formik.values.editbanner ||
            formik.values.bannerstatus ||
            formik.values.deletebanner;

        if (anyBannerChecked) {
            formik.setFieldValue("viewbanner", true);
        }


        const allBannerPermissionsChecked =
            formik.values.addbanner &&
            formik.values.editbanner &&
            formik.values.bannerstatus &&
            formik.values.deletebanner;

        formik.setFieldValue("bannerpermission", allBannerPermissionsChecked);
    }, [
        formik.values.addbanner,
        formik.values.editbanner,
        formik.values.bannerstatus,
        formik.values.deletebanner,
    ]);



    useEffect(() => {
        const couponPermissions = [
            "addcoupon",
            "editcoupon",
            "viewcoupon",
            "coupondetail",
            "deletecoupon",
            "couponstatus"
        ];

        if (formik.values.couponpermission) {

            couponPermissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {
            // const anyCouponChecked = couponPermissions.some(permission => formik.values[permission]);

            // if (!anyCouponChecked) {
            couponPermissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.couponpermission]);


    useEffect(() => {
        const anyCouponChecked =
            formik.values.addcoupon ||
            formik.values.editcoupon ||
            formik.values.coupondetail ||
            formik.values.deletecoupon;

        if (anyCouponChecked) {
            formik.setFieldValue("viewcoupon", true);
        }


        const allCouponPermissionsChecked =
            formik.values.addcoupon &&
            formik.values.editcoupon &&
            formik.values.coupondetail &&
            formik.values.deletecoupon &&
            formik.values.couponstatus;

        formik.setFieldValue("couponpermission", allCouponPermissionsChecked);
    }, [
        formik.values.addcoupon,
        formik.values.editcoupon,
        formik.values.coupondetail,
        formik.values.deletecoupon,
        formik.values.couponstatus
    ]);




    useEffect(() => {
        const blogPermissions = [
            "addblogs",
            "editblogs",
            "viewblogs",
            "blogdetail",
            "deleteblogs",
            "blogsstatus"
        ];

        if (formik.values.blogspermission) {
            blogPermissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {
            // const anyBlogChecked = blogPermissions.some(permission => formik.values[permission]);

            // if (!anyBlogChecked) {
            blogPermissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.blogspermission]);



    useEffect(() => {
        const anyBlogChecked =
            formik.values.addblogs ||
            formik.values.editblogs ||
            formik.values.blogdetail ||
            formik.values.deleteblogs ||
            formik.values.blogsstatus;

        if (anyBlogChecked) {
            formik.setFieldValue("viewblogs", true);
        }

        const allBlogPermissionsChecked =
            formik.values.addblogs &&
            formik.values.editblogs &&
            formik.values.blogdetail &&
            formik.values.deleteblogs &&
            formik.values.blogsstatus;

        formik.setFieldValue("blogspermission", allBlogPermissionsChecked);
    }, [
        formik.values.addblogs,
        formik.values.editblogs,
        formik.values.blogdetail,
        formik.values.deleteblogs,
        formik.values.blogsstatus
    ]);



    useEffect(() => {
        const faqPermissions = [
            "addfaq",
            "editfaq",
            "viewfaq",
            "deletefaq",
            "faqstatus"
        ];

        if (formik.values.faqpermission) {

            faqPermissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {

            // const anyFaqChecked = faqPermissions.some(permission => formik.values[permission]);

            // if (!anyFaqChecked) {
            faqPermissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.faqpermission]);


    useEffect(() => {
        const anyFaqChecked =
            formik.values.addfaq ||
            formik.values.editfaq ||
            formik.values.faqstatus ||
            formik.values.deletefaq;

        if (anyFaqChecked) {
            formik.setFieldValue("viewfaq", true);
        }

        const allFaqPermissionsChecked =
            formik.values.addfaq &&
            formik.values.editfaq &&
            formik.values.faqstatus &&
            formik.values.deletefaq;

        formik.setFieldValue("faqpermission", allFaqPermissionsChecked);
    }, [
        formik.values.addfaq,
        formik.values.editfaq,
        formik.values.faqstatus,
        formik.values.deletefaq
    ]);




    useEffect(() => {
        const newsPermissions = [
            "addnews",
            "editnews",
            "viewnews",
            "deletenews",
            "newsstatus"
        ];

        if (formik.values.newspermission) {
            newsPermissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {
            // const anyNewsChecked = newsPermissions.some(permission => formik.values[permission]);

            // if (!anyNewsChecked) {
            newsPermissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.newspermission]);


    useEffect(() => {
        const anyNewsChecked =
            formik.values.addnews ||
            formik.values.editnews ||
            formik.values.newsstatus ||
            formik.values.deletenews;

        if (anyNewsChecked) {
            formik.setFieldValue("viewnews", true);
        }


        const allNewsPermissionsChecked =
            formik.values.addnews &&
            formik.values.editnews &&
            formik.values.newsstatus &&
            formik.values.deletenews;

        formik.setFieldValue("newspermission", allNewsPermissionsChecked);
    }, [
        formik.values.addnews,
        formik.values.editnews,
        formik.values.newsstatus,
        formik.values.deletenews
    ]);



    useEffect(() => {
        if (formik.values.freeclientpermission == true) {
            formik.setFieldValue('addfreeclient', true);
            formik.setFieldValue('editfreeclient', true);
            formik.setFieldValue('viewfreeclient', true);
            formik.setFieldValue('freeclientstatus', true);


        }
        else {
            formik.setFieldValue('addfreeclient', false);
            formik.setFieldValue('editfreeclient', false);
            formik.setFieldValue('viewfreeclient', false);
            formik.setFieldValue('freeclientstatus', false);


        }

    }, [formik.values.freeclientpermission])


    useEffect(() => {
        if (formik.values.addfreeclient || formik.values.editfreeclient || formik.values.freeclientstatus) {
            formik.setFieldValue('viewfreeclient', true);
        }
    }, [formik.values.addfreeclient, formik.values.editfreeclient, formik.values.freeclientstatus]);



    useEffect(() => {
        const permissions = ["paymenthistory", "planexpiry", "perform", "broadcast", "ticket"];

        if (formik.values.otherpermission) {
            permissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {

            // const anyChecked = permissions.some(permission => formik.values[permission]);

            // if (!anyChecked) {
            permissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.otherpermission]);

    useEffect(() => {
        const permissions = ["paymenthistory", "planexpiry", "perform", "broadcast", "ticket"];

        const anyChecked = permissions.some(permission => formik.values[permission]);

        if (anyChecked) {
            formik.setFieldValue("otherpermission", true);
        }

        const allChecked = permissions.every(permission => formik.values[permission]);
        formik.setFieldValue("otherpermission", allChecked);
    }, [
        formik.values.paymenthistory,
        formik.values.planexpiry,
        formik.values.perform,
        formik.values.broadcast,
        formik.values.ticket,
    ]);



    useEffect(() => {
        const permissions = [
            "addbasket", "editbasket", "deletebasket", "basketActivestatus",
            "Rebalancestatus", "Rebalancebutton", "Subscriptionhistory",
            "publishstock", "vewbasket", "basketdetail", "addstock",
            "editstock", "allbaskethistory"
        ];

        if (formik.values.basketpermission) {
            permissions.forEach(permission => formik.setFieldValue(permission, true));
        } else {
            // const anyChecked = permissions.some(permission => formik.values[permission]);

            // if (!anyChecked) {
            permissions.forEach(permission => formik.setFieldValue(permission, false));
            // }
        }
    }, [formik.values.basketpermission]);



    useEffect(() => {
        const permissions = [
            "addbasket", "editbasket", "deletebasket", "basketActivestatus",
            "Rebalancestatus", "Rebalancebutton", "Subscriptionhistory",
            "publishstock", "vewbasket", "basketdetail", "addstock",
            "editstock", "allbaskethistory"
        ];

        const anyChecked = [
            formik.values.addbasket, formik.values.editbasket, formik.values.deletebasket,
            formik.values.basketActivestatus, formik.values.Rebalancestatus, formik.values.Rebalancebutton,
            formik.values.Subscriptionhistory, formik.values.publishstock, formik.values.basketdetail,
            formik.values.addstock, formik.values.editstock, formik.values.allbaskethistory
        ].some(value => value);

        if (anyChecked) {
            formik.setFieldValue("vewbasket", true);
        }

        const allChecked = permissions.every(permission => formik.values[permission]);
        formik.setFieldValue("basketpermission", allChecked);
    }, [
        formik.values.addbasket, formik.values.editbasket, formik.values.deletebasket,
        formik.values.basketActivestatus, formik.values.Rebalancestatus, formik.values.Rebalancebutton,
        formik.values.Subscriptionhistory, formik.values.publishstock, formik.values.vewbasket,
        formik.values.basketdetail, formik.values.addstock, formik.values.editstock, formik.values.allbaskethistory
    ]);



    const fields = [
        {
            name: 'FullName',
            label: 'Full Name',
            type: 'text',
            label_size: 6,
            col_size: 6,
            disable: true,
        },
        {
            name: 'UserName',
            label: 'User Name',
            type: 'text',
            label_size: 12,
            col_size: 6,
            disable: true,
        },
        {
            name: 'userPermissions',
            label: 'All Client Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.userPermissions,
            bold: true


        },
        {
            name: 'viewclient',
            label: 'View Client ',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewclient,
            check_box_true: formik.values.userPermissions || formik.values.Ownclient || formik.values.assignPackage || formik.values.clientchangestatus || formik.values.editclient || formik.values.viewdetail || formik.values.addclient || formik.values.viewclient ? true : false,

        },
        {
            name: 'Ownclient',
            label: 'Own Client',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addclient,
            check_box_true: formik.values.Ownclient ? true : false,
        },
        {
            name: 'addclient',
            label: 'Add Client',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addclient,
            check_box_true: formik.values.userPermissions || formik.values.addclient ? true : false,
        },
        {
            name: 'viewdetail',
            label: 'View Detail',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewdetail,
            check_box_true: formik.values.userPermissions || formik.values.viewdetail ? true : false,

        },
        {
            name: 'editclient',
            label: 'Edit Client',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editclient,
            check_box_true: formik.values.userPermissions || formik.values.editclient ? true : false,
        },
        // {
        //     name: 'deleteclient',
        //     label: 'Delete Client',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.deleteclient,
        //     check_box_true: formik.values.userPermissions || formik.values.deleteclient ? true : false,
        // },
        {
            name: 'clientchangestatus',
            label: 'Client Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.clientchangestatus,
            check_box_true: formik.values.userPermissions || formik.values.clientchangestatus ? true : false,
        },
        {
            name: 'assignPackage',
            label: 'Assign Package',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.clientchangestatus,
            check_box_true: formik.values.userPermissions || formik.values.assignPackage ? true : false,
        },
        {
            name: 'planpermission',
            label: 'All Plan Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.planpermission,
            bold: true
        },
        {
            name: 'viewplan',
            label: 'View Plan',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewPlan,
            check_box_true: formik.values.planpermission || formik.values.planstatus || formik.values.editplan || formik.values.addplan || formik.values.viewplan ? true : false,
        },
        {
            name: 'addplan',
            label: 'Add Plan',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addPlan,
            check_box_true: formik.values.planpermission || formik.values.addplan ? true : false,

        },
        {
            name: 'editplan',
            label: 'Edit Plan',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editPlan,
            check_box_true: formik.values.planpermission || formik.values.editplan ? true : false,
        },
        // {
        //     name: 'deleteplan',
        //     label: 'Delete Plan',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.deletePlan,
        //     check_box_true: formik.values.planpermission || formik.values.deleteplan ? true : false,
        // },
        {
            name: 'planstatus',
            label: 'Plan Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deletePlan,
            check_box_true: formik.values.planpermission || formik.values.planstatus ? true : false,
        },


        {
            name: 'Signalpermission',
            label: 'All Signal Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.Signalpermission,
            bold: true
        },
        {
            name: 'viewsignal',
            label: 'View Signal',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.Signalpermission || formik.values.ownsignal || formik.values.signalstatus || formik.values.editsignal || formik.values.signaldetail || formik.values.addsignal || formik.values.Strategy || formik.values.viewsignal ? true : false,
        },
        {
            name: 'ownsignal',
            label: 'Own Signal',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.ownsignal ? true : false,

        },
        {
            name: 'addsignal',
            label: 'Add Signal',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.Signalpermission || formik.values.addsignal ? true : false,

        },
        {
            name: 'signaldetail',
            label: 'Signal Detail',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.Signalpermission || formik.values.signaldetail ? true : false,
        },
        {
            name: 'editsignal',
            label: 'Update pdf',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.Signalpermission || formik.values.editsignal ? true : false,
        },
        // {
        //     name: 'deletesignal',
        //     label: 'Delete Signal',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.deleteservice,
        //     check_box_true: formik.values.Signalpermission || formik.values.deletesignal ? true : false,
        // },
        {
            name: 'signalstatus',
            label: 'Signal Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.Signalpermission || formik.values.signalstatus ? true : false,
        },
        {
            name: 'Strategy',
            label: 'Strategy',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.Signalpermission || formik.values.Strategy ? true : false,
        },

        {
            name: 'basketpermission',
            label: 'All Basket Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.basketpermission,
            bold: true
        },
        {
            name: 'vewbasket',
            label: 'View Basket',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.basketpermission || formik.values.addbasket || formik.values.editbasket || formik.values.deletebasket || formik.values.basketActivestatus || formik.values.Rebalancestatus || formik.values.Rebalancebutton || formik.values.Subscriptionhistory || formik.values.vewbasket ? true : false,
        },
        {
            name: 'addbasket',
            label: 'Add Basket',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.basketpermission || formik.values.addbasket ? true : false,
        },
        {
            name: 'editbasket',
            label: 'Edit Basket',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.basketpermission || formik.values.editbasket ? true : false,

        },
        {
            name: 'deletebasket',
            label: 'Delete Basket',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.basketpermission || formik.values.deletebasket ? true : false,

        },
        {
            name: 'basketActivestatus',
            label: 'Basket Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.basketpermission || formik.values.basketActivestatus ? true : false,
        },
        {
            name: 'basketdetail',
            label: 'Basket Detail',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.basketpermission || formik.values.basketdetail ? true : false,
        },
        {
            name: 'publishstock',
            label: 'Publish Stock',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.basketpermission || formik.values.publishstock ? true : false,
        },
        {
            name: 'Rebalancestatus',
            label: 'Rebalance Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.basketpermission || formik.values.Rebalancestatus ? true : false,
        },
        {
            name: 'Rebalancebutton',
            label: 'Rebalance Stock',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.basketpermission || formik.values.Rebalancebutton ? true : false,
        },
        {
            name: 'addstock',
            label: 'Add Stock',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.basketpermission || formik.values.addstock ? true : false,
        },
        {
            name: 'editstock',
            label: 'Edit Stock',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.basketpermission || formik.values.editstock ? true : false,
        },
        {
            name: 'Subscriptionhistory',
            label: 'Subscription History',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.basketpermission || formik.values.Subscriptionhistory ? true : false,
        },
        {
            name: 'allbaskethistory',
            label: 'All Basket History',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.basketpermission || formik.values.allbaskethistory ? true : false,
        },


        // {
        //     name: 'Staffpermission',
        //     label: 'All Staff',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     check_box_true: formik.values.Staffpermission,
        //     bold: true
        // },
        // {
        //     name: 'viewstaff',
        //     label: 'View Staff',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.viewservice,
        //     check_box_true: formik.values.Staffpermission ||  formik.values.staffstatus || formik.values.editstaff || formik.values.addstaff || formik.values.viewstaff ? true : false,
        // },
        // {
        //     name: 'addstaff',
        //     label: 'Add Staff',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.addservice,
        //     check_box_true: formik.values.Staffpermission || formik.values.addstaff ? true : false,

        // },
        // {
        //     name: 'editstaff',
        //     label: 'Edit Staff',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.editservice,
        //     check_box_true: formik.values.Staffpermission || formik.values.editstaff ? true : false,
        // },
        // // {
        // //     name: 'deletestaff',
        // //     label: 'Delete Staff',
        // //     type: 'checkbox',
        // //     label_size: 12,
        // //     col_size: 2,
        // //     // check_box_true: formik.values.deleteservice,
        // //     check_box_true: formik.values.Staffpermission || formik.values.deletestaff ? true : false,
        // // },
        // {
        //     name: 'staffstatus',
        //     label: 'Staff Status',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.deleteservice,
        //     check_box_true: formik.values.Staffpermission || formik.values.staffstatus ? true : false,
        // },


        {
            name: 'newspermission',
            label: 'All News Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.newspermission,
            bold: true
        },
        {
            name: 'viewnews',
            label: 'View news',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.newspermission || formik.values.deletenews || formik.values.newsstatus || formik.values.editnews || formik.values.addnews || formik.values.viewnews ? true : false,
        },
        {
            name: 'addnews',
            label: 'Add news',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.newspermission || formik.values.addnews ? true : false,

        },
        {
            name: 'editnews',
            label: 'Edit news',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.newspermission || formik.values.editnews ? true : false,
        },
        {
            name: 'deletenews',
            label: 'Delete news',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.newspermission || formik.values.deletenews ? true : false,
        },
        {
            name: 'newsstatus',
            label: 'News Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.newspermission || formik.values.newsstatus ? true : false,
        },


        {
            name: 'bannerpermission',
            label: 'All Banner Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.bannerpermission,
            bold: true
        },
        {
            name: 'viewbanner',
            label: 'View banner',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.bannerpermission || formik.values.deletebanner || formik.values.bannerstatus || formik.values.editbanner || formik.values.addbanner || formik.values.viewbanner ? true : false,
        },
        {
            name: 'addbanner',
            label: 'Add banner',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.bannerpermission || formik.values.addbanner ? true : false,

        },
        {
            name: 'editbanner',
            label: 'Edit banner',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.bannerpermission || formik.values.editbanner ? true : false,
        },
        {
            name: 'deletebanner',
            label: 'Delete banner',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.bannerpermission || formik.values.deletebanner ? true : false,
        },
        {
            name: 'bannerstatus',
            label: 'banner Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.bannerpermission || formik.values.bannerstatus ? true : false,
        },


        {
            name: 'couponpermission',
            label: 'All Coupon Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.couponpermission,
            bold: true
        },
        {
            name: 'viewcoupon',
            label: 'View coupon',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.couponpermission || formik.values.deletecoupon || formik.values.couponstatus || formik.values.editcoupon || formik.values.coupondetail || formik.values.addcoupon || formik.values.viewcoupon ? true : false,
        },
        {
            name: 'addcoupon',
            label: 'Add coupon',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.couponpermission || formik.values.addcoupon ? true : false,

        },
        {
            name: 'coupondetail',
            label: 'coupon Detail',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.couponpermission || formik.values.coupondetail ? true : false,
        },
        {
            name: 'editcoupon',
            label: 'Edit coupon',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.couponpermission || formik.values.editcoupon ? true : false,
        },
        {
            name: 'deletecoupon',
            label: 'Delete coupon',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.couponpermission || formik.values.deletecoupon ? true : false,
        },
        {
            name: 'couponstatus',
            label: 'Coupon Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.couponpermission || formik.values.couponstatus ? true : false,
        },

        {
            name: 'blogspermission',
            label: 'All Blogs Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.blogspermission,
            bold: true
        },
        {
            name: 'viewblogs',
            label: 'View blogs',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.blogspermission || formik.values.deleteblogs || formik.values.blogsstatus || formik.values.editblogs || formik.values.blogdetail || formik.values.addblogs || formik.values.viewblogs ? true : false,
        },
        {
            name: 'addblogs',
            label: 'Add blogs',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.blogspermission || formik.values.addblogs ? true : false,

        },
        {
            name: 'blogdetail',
            label: 'View Details',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.blogspermission || formik.values.blogdetail ? true : false,
        },
        {
            name: 'editblogs',
            label: 'Edit blogs',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.blogspermission || formik.values.editblogs ? true : false,
        },
        {
            name: 'deleteblogs',
            label: 'Delete blogs',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.blogspermission || formik.values.deleteblogs ? true : false,
        },
        {
            name: 'blogsstatus',
            label: 'Blogs Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.blogspermission || formik.values.blogsstatus ? true : false,
        },


        {
            name: 'faqpermission',
            label: 'All Faq Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.faqpermission,
            bold: true
        },
        {
            name: 'viewfaq',
            label: 'View faq',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.faqpermission || formik.values.deletefaq || formik.values.faqstatus || formik.values.editfaq || formik.values.addfaq || formik.values.viewfaq ? true : false,
        },
        {
            name: 'addfaq',
            label: 'Add faq',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.faqpermission || formik.values.addfaq ? true : false,

        },
        {
            name: 'editfaq',
            label: 'Edit faq',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.faqpermission || formik.values.editfaq ? true : false,
        },
        {
            name: 'deletefaq',
            label: 'Delete faq',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.faqpermission || formik.values.deletefaq ? true : false,
        },
        {
            name: 'faqstatus',
            label: 'Faq Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.faqpermission || formik.values.faqstatus ? true : false,
        },
        {
            name: 'categorypermission',
            label: 'All category Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.categorypermission,
            bold: true
        },
        {
            name: 'viewcategory',
            label: 'View category',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.categorypermission || formik.values.categorystatus || formik.values.editcategory || formik.values.editcategory || formik.values.addcategory || formik.values.viewcategory ? true : false,
        },
        {
            name: 'addcategory',
            label: 'Add category',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.addservice,
            check_box_true: formik.values.categorypermission || formik.values.addcategory ? true : false,

        },
        {
            name: 'editcategory',
            label: 'Edit category',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.categorypermission || formik.values.editcategory ? true : false,
        },
        // {
        //     name: 'deletecategory',
        //     label: 'Delete category',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.deleteservice,
        //     check_box_true: formik.values.categorypermission || formik.values.deletecategory ? true : false,
        // },
        {
            name: 'categorystatus',
            label: 'category Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.categorypermission || formik.values.categorystatus ? true : false,
        },
        {
            name: 'freeclientpermission',
            label: 'All Free Client Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.freeclientpermission,
            bold: true

        },
        {
            name: 'viewfreeclient',
            label: 'View Free Client',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.editservice,
            check_box_true: formik.values.freeclientpermission || formik.values.editfreeclient || formik.values.freeclientstatus || formik.values.addfreeclient || formik.values.freeclientstatus || formik.values.viewfreeclient ? true : false,
        },
        // {
        //     name: 'addfreeclient',
        //     label: 'Add Free Client',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.viewservice,
        //     check_box_true: formik.values.freeclientpermission || formik.values.addfreeclient ? true : false,
        // },
        // {
        //     name: 'editfreeclient',
        //     label: 'Edit Free Client',
        //     type: 'checkbox',
        //     label_size: 12,
        //     col_size: 2,
        //     // check_box_true: formik.values.deleteservice,
        //     check_box_true: formik.values.freeclientpermission || formik.values.editfreeclient ? true : false,
        // },
        {
            name: 'freeclientstatus',
            label: 'Free Client Status',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.deleteservice,
            check_box_true: formik.values.freeclientpermission || formik.values.freeclientstatus ? true : false,
        },
        {
            name: 'otherpermission',
            label: 'Others Permissions',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            check_box_true: formik.values.otherpermission,
            bold: true

        },
        {
            name: 'paymenthistory',
            label: 'Payment History',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.otherpermission || formik.values.paymenthistory ? true : false,
        },
        {
            name: 'planexpiry',
            label: 'Plan Expiry',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.otherpermission || formik.values.planexpiry ? true : false,
        },
        {
            name: 'perform',
            label: 'Performance',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.otherpermission || formik.values.perform ? true : false,
        },
        {
            name: 'broadcast',
            label: 'Broadcast',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.otherpermission || formik.values.broadcast ? true : false,
        },
        {
            name: 'ticket',
            label: 'Ticket',
            type: 'checkbox',
            label_size: 12,
            col_size: 2,
            // check_box_true: formik.values.viewservice,
            check_box_true: formik.values.otherpermission || formik.values.ticket ? true : false,
        },


    ];

    return (
        <Content
            Page_title="Edit Permission"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields}
                // page_title="Edit Permission"
                btn_name="Edit Permission"
                btn_name1="Cancel"
                sumit_btn={true}
                formik={formik}
                btn_name1_route={'/admin/staff'}
                additional_field={<></>}
            />
        </Content>
    );

};

export default Staffpermission;  
