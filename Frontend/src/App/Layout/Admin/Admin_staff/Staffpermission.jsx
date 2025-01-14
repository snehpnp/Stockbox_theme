import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { addStaffpermission, getstaffperuser } from '../../../Services/Admin/Admin';
import { Subscript } from 'lucide-react';

const Staffpermission = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { row } = location.state;
    const token = localStorage.getItem('token');
    const [clients, setClients] = useState([]);
    const _id = row._id;




    useEffect(() => {
        getAdminclient();
    }, []);

    const getAdminclient = async () => {
        try {
            const response = await getstaffperuser(_id, token);
            if (response.status) {
                setClients(response.data.permissions);
            }
        } catch (error) {
            console.log("Error fetching client permissions:", error);
        }
    };




    const onSubmit = async (values) => {
        const permissions = Object.keys(values).filter(key => values[key] === true);

        const req = {
            permissions,
            id: row._id,
        };

        try {
            const response = await addStaffpermission(req, token);
            if (response.status) {
                Swal.fire({
                    title: 'Update Successful!',
                    text: response.message,
                    icon: 'success',
                    timer: 1500,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    navigate('/admin/staff');
                }, 1500);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.message,
                    icon: 'error',
                    timer: 1500,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'An unexpected error occurred. Please try again later.',
                icon: 'error',
                timer: 1500,
                timerProgressBar: true,
            });
        }
    };

    const formik = useFormik({
        initialValues: {
            FullName: row?.FullName || '',
            UserName: row?.UserName || '',
            Email: row?.Email || '',
            PhoneNo: row?.PhoneNo || '',

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





    useEffect(() => {
        if (formik.values.addclient || formik.values.editclient || formik.values.clientchangestatus || formik.values.assignPackage || formik.values.Ownclient) {
            formik.setFieldValue('viewclient', true);
        }
    }, [formik.values.addclient, formik.values.editclient, formik.values.clientchangestatus, formik.values.assignPackage, formik.values.Ownclient]);




    useEffect(() => {
        if (formik.values.Signalpermission == true) {
            formik.setFieldValue('signalstatus', true);
            formik.setFieldValue('ownsignal', false);
            formik.setFieldValue('viewsignal', true);
            formik.setFieldValue('signaldetail', true);
            formik.setFieldValue('addsignal', true);
            formik.setFieldValue('editsignal', true);
            // formik.setFieldValue('deletesignal', true);

        }
        else {
            formik.setFieldValue('signalstatus', false);
            // formik.setFieldValue('ownsignal', false);
            formik.setFieldValue('viewsignal', false);
            formik.setFieldValue('signaldetail', false);
            formik.setFieldValue('addsignal', false);
            formik.setFieldValue('editsignal', false);
            // formik.setFieldValue('deletesignal', false);

        }

    }, [formik.values.Signalpermission])


    useEffect(() => {
        if (formik.values.signalstatus || formik.values.ownsignal || formik.values.signaldetail || formik.values.addsignal || formik.values.editsignal) {
            formik.setFieldValue('viewsignal', true);
        }
    }, [formik.values.signalstatus, formik.values.signaldetail, formik.values.addsignal, formik.values.editsignal, formik.values.ownsignal]);




    useEffect(() => {
        if (formik.values.categorypermission == true) {
            formik.setFieldValue('categorystatus', true);
            formik.setFieldValue('viewcategory', true);
            formik.setFieldValue('addcategory', true);
            formik.setFieldValue('editcategory', true);
            // formik.setFieldValue('deletecategory', true);

        }
        else {
            formik.setFieldValue('categorystatus', false);
            formik.setFieldValue('viewcategory', false);
            formik.setFieldValue('addcategory', false);
            formik.setFieldValue('editcategory', false);
            // formik.setFieldValue('deletecategory', false);

        }

    }, [formik.values.categorypermission])


    useEffect(() => {
        if (formik.values.categorystatus || formik.values.addcategory || formik.values.editcategory) {
            formik.setFieldValue('viewcategory', true);
        }
    }, [formik.values.categorystatus, formik.values.addcategory, formik.values.editcategory]);



    useEffect(() => {
        if (formik.values.planpermission == true) {
            formik.setFieldValue('addplan', true);
            formik.setFieldValue('editplan', true);
            // formik.setFieldValue('deleteplan', true);
            formik.setFieldValue('viewplan', true);
            formik.setFieldValue('planstatus', true);

        }
        else {
            formik.setFieldValue('addplan', false);
            formik.setFieldValue('editplan', false);
            // formik.setFieldValue('deleteplan', false);
            formik.setFieldValue('viewplan', false);
            formik.setFieldValue('planstatus', false);

        }

    }, [formik.values.planpermission])


    useEffect(() => {
        if (formik.values.addplan || formik.values.editplan || formik.values.planstatus) {
            formik.setFieldValue('viewplan', true);
        }
    }, [formik.values.addplan, formik.values.editplan, formik.values.planstatus]);




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


    useEffect(() => {
        if (formik.values.addstaff || formik.values.editstaff || formik.values.staffstatus) {
            formik.setFieldValue('viewstaff', true);
        }
    }, [formik.values.addstaff, formik.values.editstaff, formik.values.staffstatus]);



    useEffect(() => {
        if (formik.values.bannerpermission == true) {
            formik.setFieldValue('addbanner', true);
            formik.setFieldValue('editbanner', true);
            formik.setFieldValue('viewbanner', true);
            formik.setFieldValue('deletebanner', true);
            formik.setFieldValue('bannerstatus', true);

        }
        else {
            formik.setFieldValue('addbanner', false);
            formik.setFieldValue('editbanner', false);
            formik.setFieldValue('viewbanner', false);
            formik.setFieldValue('deletebanner', false);
            formik.setFieldValue('bannerstatus', false);

        }

    }, [formik.values.bannerpermission])



    useEffect(() => {
        if (formik.values.addbanner || formik.values.editbanner || formik.values.bannerstatus || formik.values.deletebanner) {
            formik.setFieldValue('viewbanner', true);
        }
    }, [formik.values.addbanner, formik.values.editbanner, formik.values.bannerstatus, formik.values.deletebanner]);




    useEffect(() => {
        if (formik.values.couponpermission == true) {
            formik.setFieldValue('addcoupon', true);
            formik.setFieldValue('editcoupon', true);
            formik.setFieldValue('viewcoupon', true);
            formik.setFieldValue('coupondetail', true);
            formik.setFieldValue('deletecoupon', true);
            formik.setFieldValue('couponstatus', true);

        }
        else {
            formik.setFieldValue('addcoupon', false);
            formik.setFieldValue('editcoupon', false);
            formik.setFieldValue('viewcoupon', false);
            formik.setFieldValue('coupondetail', false);
            formik.setFieldValue('deletecoupon', false);
            formik.setFieldValue('couponstatus', false);

        }

    }, [formik.values.couponpermission])


    useEffect(() => {
        if (formik.values.addcoupon || formik.values.editcoupon || formik.values.coupondetail || formik.values.coupondetail || formik.values.deletecoupon) {
            formik.setFieldValue('viewcoupon', true);
        }
    }, [formik.values.addcoupon, formik.values.editcoupon, formik.values.coupondetail, formik.values.coupondetail, formik.values.deletecoupon]);





    useEffect(() => {
        if (formik.values.blogspermission == true) {
            formik.setFieldValue('addblogs', true);
            formik.setFieldValue('editblogs', true);
            formik.setFieldValue('viewblogs', true);
            formik.setFieldValue('blogdetail', true);
            formik.setFieldValue('deleteblogs', true);
            formik.setFieldValue('blogsstatus', true);

        }
        else {
            formik.setFieldValue('addblogs', false);
            formik.setFieldValue('editblogs', false);
            formik.setFieldValue('viewblogs', false);
            formik.setFieldValue('blogdetail', false);
            formik.setFieldValue('deleteblogs', false);
            formik.setFieldValue('blogsstatus', false);

        }

    }, [formik.values.blogspermission])


    useEffect(() => {
        if (formik.values.addblogs || formik.values.editblogs || formik.values.blogdetail || formik.values.blogsstatus || formik.values.blogdetail) {
            formik.setFieldValue('viewblogs', true);
        }
    }, [formik.values.addblogs, formik.values.editblogs, formik.values.blogdetail, formik.values.blogsstatus, formik.values.blogdetail]);



    useEffect(() => {
        if (formik.values.faqpermission == true) {
            formik.setFieldValue('addfaq', true);
            formik.setFieldValue('editfaq', true);
            formik.setFieldValue('viewfaq', true);
            formik.setFieldValue('deletefaq', true);
            formik.setFieldValue('faqstatus', true);

        }
        else {
            formik.setFieldValue('addfaq', false);
            formik.setFieldValue('editfaq', false);
            formik.setFieldValue('viewfaq', false);
            formik.setFieldValue('deletefaq', false);
            formik.setFieldValue('faqstatus', false);

        }

    }, [formik.values.faqpermission])



    useEffect(() => {
        if (formik.values.addfaq || formik.values.editfaq || formik.values.faqstatus || formik.values.deletefaq) {
            formik.setFieldValue('viewfaq', true);
        }
    }, [formik.values.addfaq, formik.values.editfaq, formik.values.faqstatus, formik.values.deletefaq]);




    useEffect(() => {
        if (formik.values.newspermission == true) {
            formik.setFieldValue('addnews', true);
            formik.setFieldValue('editnews', true);
            formik.setFieldValue('viewnews', true);
            formik.setFieldValue('deletenews', true);
            formik.setFieldValue('newsstatus', true);

        }
        else {
            formik.setFieldValue('addnews', false);
            formik.setFieldValue('editnews', false);
            formik.setFieldValue('viewnews', false);
            formik.setFieldValue('deletenews', false);
            formik.setFieldValue('newsstatus', false);

        }

    }, [formik.values.newspermission])


    useEffect(() => {
        if (formik.values.addnews || formik.values.editnews || formik.values.newsstatus || formik.values.deletenews) {
            formik.setFieldValue('viewnews', true);
        }
    }, [formik.values.addnews, formik.values.editnews, formik.values.newsstatus, formik.values.deletenews]);



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
        if (formik.values.otherpermission == true) {
            formik.setFieldValue('paymenthistory', true);
            formik.setFieldValue('planexpiry', true);
            formik.setFieldValue('perform', true);



        }
        else {
            formik.setFieldValue('paymenthistory', false);
            formik.setFieldValue('planexpiry', false);
            formik.setFieldValue('perform', false);



        }

    }, [formik.values.otherpermission])


    // useEffect(() => {
    //     if (formik.values.paymenthistory || formik.values.planexpiry ||  formik.values.perform  ) {
    //         formik.setFieldValue('otherpermission', true);
    //     }
    // }, [formik.values.paymenthistory ,formik.values.planexpiry ,formik.values.perform ]);



    useEffect(() => {
        if (formik.values.basketpermission == true) {
            formik.setFieldValue('addbasket', true);
            formik.setFieldValue('editbasket', true);
            formik.setFieldValue('deletebasket', true);
            formik.setFieldValue('basketActivestatus', true);
            formik.setFieldValue('Rebalancestatus', true);
            formik.setFieldValue('Rebalancebutton', true);
            formik.setFieldValue('Subscriptionhistory', true);
            formik.setFieldValue('publishstock', true);
            formik.setFieldValue('vewbasket', true);
            formik.setFieldValue('basketdetail', true);
            formik.setFieldValue('addstock', true);
            formik.setFieldValue('editstock', true);
            formik.setFieldValue('allbaskethistory', true);



        }
        else {
            formik.setFieldValue('addbasket', false);
            formik.setFieldValue('editbasket', false);
            formik.setFieldValue('deletebasket', false);
            formik.setFieldValue('basketActivestatus', false);
            formik.setFieldValue('Rebalancestatus', false);
            formik.setFieldValue('Rebalancebutton', false);
            formik.setFieldValue('Subscriptionhistory', false);
            formik.setFieldValue('publishstock', false);
            formik.setFieldValue('vewbasket', false);
            formik.setFieldValue('basketdetail', false);
            formik.setFieldValue('addstock', false);
            formik.setFieldValue('editstock', false);
            formik.setFieldValue('allbaskethistory', false);


        }

    }, [formik.values.basketpermission])


    useEffect(() => {
        if (formik.values.addbasket || formik.values.allbaskethistory || formik.values.editstock || formik.values.addstock || formik.values.basketdetail || formik.values.editbasket || formik.values.deletebasket || formik.values.basketActivestatus || formik.values.Rebalancestatus
            || formik.values.Rebalancebutton || formik.values.Subscriptionhistory || formik.values.publishstock
        ) {
            formik.setFieldValue('vewbasket', true);
        }
    }, [formik.values.addbasket, formik.values.editbasket, formik.values.deletebasket, formik.values.basketActivestatus, formik.values.Rebalancestatus
        , formik.values.Rebalancebutton, formik.values.allbaskethistory, formik.values.editstock, formik.values.addstock, formik.values.basketdetail, formik.values.Subscriptionhistory, formik.values.publishstock]);




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
            check_box_true: formik.values.Signalpermission || formik.values.ownsignal || formik.values.signalstatus || formik.values.editsignal || formik.values.signaldetail || formik.values.addsignal || formik.values.viewsignal ? true : false,
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






    ];

    return (
        <div style={{ marginTop: '100px' }}>
            <DynamicForm
                fields={fields}
                page_title="Edit Permission"
                btn_name="Edit Permission"
                btn_name1="Cancel"
                sumit_btn={true}
                formik={formik}
                btn_name1_route={'/admin/staff'}
                additional_field={<></>}
            />
        </div>
    );

};

export default Staffpermission;  
