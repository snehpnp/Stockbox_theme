import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from '../../../Extracomponents/Table1';
import { Settings2, Eye, SquarePen, Trash2, Download, ArrowDownToLine } from 'lucide-react';
import Swal from 'sweetalert2';
import { FreeClientList, FreeClientListWithFilter, PlanSubscription, BasketSubscription, DeleteFreeClient, getcategoryplan, getplanlist, getPlanbyUser, BasketAllActiveList } from '../../../Services/Admin/Admin';
import { Tooltip } from 'antd';
import { image_baseurl } from '../../../../Utils/config';
import { fDate, fDateTime } from '../../../../Utils/Date_formate';
import { IndianRupee } from 'lucide-react';
import { exportToCSV } from '../../../../Utils/ExportData';
import Loader from '../../../../Utils/Loader';
import ReusableModal from '../../../components/Models/ReusableModal';

const Freeclient = () => {


    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const location = useLocation()
    const clientStatus = location?.state?.clientStatus;


    const [clients, setClients] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null)
    const [selectcategory, setSelectcategory] = useState(null)
    const [planlist, setPlanlist] = useState([]);
    const [checkedIndex, setCheckedIndex] = useState(0);
    const [category, setCategory] = useState([]);
    const [client, setClientid] = useState({});
    const [ForGetCSV, setForGetCSV] = useState([])
    const [searchInput, setSearchInput] = useState("");
    const [header, setheader] = useState("Free Trial Client");

    const [getBasket, setGetBasket] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);


    //state for loading
    const [isLoading, setIsLoading] = useState(true)

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const [updatetitle, setUpdatetitle] = useState({
        plan_id: "",
        client_id: "",
        price: ""
    });


    const [basketdetail, setBasketdetail] = useState({
        basket_id: "",
        client_id: "",
        price: "",

    });



    useEffect(() => {
        if (clientStatus == "active") {
            setheader("Free Trial Active Client")
        } else if (clientStatus == "expired") {
            setheader("Free  Trial Deactive Client")
        }
    }, [clientStatus, clients])



    useEffect(() => {
        // getdemoclient();
        getcategoryplanlist()
        getActiveBasketdetail()
    }, []);




    const getdemoclient = async () => {
        try {
            const data = { page: currentPage, search: searchInput, freestatus: clientStatus || "" }
            const response = await FreeClientListWithFilter(data, token);
            if (response.status) {
                setTotalRows(response.pagination.total)
                setClients(response.data);

            }
        } catch (error) {
            console.log("error")
        }
        setIsLoading(false)
    }


    useEffect(() => {
        getdemoclient();
    }, [client, currentPage, searchInput]);




    const getActiveBasketdetail = async () => {
        try {
            const response = await BasketAllActiveList(token);
            if (response.status) {
                setGetBasket(response.data);

            }
        } catch (error) {
            console.log("error");
        }
    };




    const getexportfile = async () => {
        try {

            const response = await FreeClientList(token);
            if (response.status) {
                if (response.data?.length > 0) {
                    const csvArr = response.data?.map((item) => ({

                        FullName: item.clientDetails?.FullName || '-',
                        Email: item.clientDetails?.Email || '-',
                        PhoneNo: item?.clientDetails?.PhoneNo || '-',
                        Kyc: item?.clientDetails?.kyc_verification == 1 ? "Verified" : "Not Verified",
                        Status: item?.status === "active" ? "Active" : "Expired",
                        StartDate: fDateTime(item?.startdate) || '-',
                        EndDate: fDateTime(item?.enddate) || '-',

                    }));
                    exportToCSV(csvArr, 'All Free Clients')

                }
            }
        } catch (error) {
            console.log("error");
        }
    }



    const getplanlistassinstatus = async (_id) => {
        try {

            const response = await getPlanbyUser(_id, token);
            if (response.status) {
                setPlanlist(response.data);
            }
        } catch (error) {
            console.log("error");
        }
    }





    const getcategoryplanlist = async () => {
        try {
            const response = await getcategoryplan(token);
            if (response.status) {
                setCategory(response.data);
            }
        } catch (error) {
            console.log("error");
        }
    };



    const handleTabChange = (index) => {
        setCheckedIndex(index);
    };


    const showModal = () => {
        setIsModalVisible(true);
    };


    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectcategory("")
    };


    const handleCategoryChange = (categoryId) => {
        setSelectcategory(categoryId);
        setSelectedPlanId(null);
        setUpdatetitle("")
    };





    const handleDownload = (row) => {

        const url = `${image_baseurl}uploads/pdf/${row.clientDetails.pdf}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = url;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };


    const updateClient = async (row) => {
        navigate("/admin/editfreeclient/" + row.clientid, { state: { row } })
    }




    const DeleteClient = async (_id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this member? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
            });

            if (result.isConfirmed) {
                const response = await DeleteFreeClient(_id, token);
                if (response.status) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The Client has been successfully deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    getdemoclient();

                }
            } else {

                Swal.fire({
                    title: 'Cancelled',
                    text: 'The  deletion was cancelled.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the Member.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });

        }
    };



    // // update status 

    // const handleSwitchChange = async (event, id) => {

    //     const user_active_status = event.target.checked ? "1" : "0";

    //     const data = { id: id, status: user_active_status }
    //     const result = await Swal.fire({
    //         title: "Do you want to save the changes?",
    //         showCancelButton: true,
    //         confirmButtonText: "Save",
    //         cancelButtonText: "Cancel",
    //         allowOutsideClick: false,
    //     });

    //     if (result.isConfirmed) {
    //         try {
    //             const response = await UpdateClientStatus(data, token)
    //             if (response.status) {
    //                 Swal.fire({
    //                     title: "Saved!",
    //                     icon: "success",
    //                     timer: 1000,
    //                     timerProgressBar: true,
    //                 });
    //                 setTimeout(() => {
    //                     Swal.close();
    //                 }, 1000);
    //             }
    //             getdemoclient();
    //         } catch (error) {
    //             Swal.fire(
    //                 "Error",
    //                 "There was an error processing your request.",
    //                 "error"
    //             );
    //         }
    //     } else if (result.dismiss === Swal.DismissReason.cancel) {
    //         getdemoclient();
    //     }
    // };




    // Update service
    const Updateplansubscription = async () => {

        try {
            const data = { plan_id: updatetitle.plan_id, client_id: client.clientid, price: updatetitle.price };
            const response = await PlanSubscription(data, token);


            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: response.message || 'Plan updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setUpdatetitle({ plan_id: "", client_id: "", price: "" });
                getdemoclient();
                handleCancel()
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error updating the Plan.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Server error',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };


    // assign basket 
    const UpdateBasketservice = async () => {

        try {
            const data = { basket_id: basketdetail.basket_id, client_id: client._id, price: basketdetail.price, };
            const response = await BasketSubscription(data, token);
            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Basket service updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setBasketdetail({ basket_id: "", client_id: "", price: "" });
                getdemoclient();
                handleCancel()
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error updating the Basket.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the Basket.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };



    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '80px',
        },
        {
            name: 'Full Name',
            selector: row => row.clientDetails?.FullName,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Email',
            selector: row => row.clientDetails?.Email,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Phone No',
            selector: row => row.clientDetails?.PhoneNo,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Kyc',
            selector: row => (
                row.clientDetails?.kyc_verification === "1" ? (
                    <div style={{ color: "green", cursor: "pointer" }} onClick={() => handleDownload(row)}>
                        <Tooltip placement="top" overlay="Download">
                            Verified <ArrowDownToLine />
                        </Tooltip>
                    </div>
                ) : (
                    <div style={{ color: "red" }}>
                        Not Verified
                    </div>
                )
            ),
            sortable: true,
            width: '200px',
        },
        {
            name: 'Status',
            selector: row => (
                <span style={{ color: row.status === "active" ? "green" : "red" }}>
                    {row.status === "active" ? "Active" : "Expired"}
                </span>
            ),
            sortable: true,
            width: '200px',
        },
        {
            name: 'Start Date',
            selector: row => fDateTime(row.startdate),
            sortable: true,
            width: '200px',
        },
        {
            name: 'End Date',
            selector: row => fDateTime(row.enddate),
            sortable: true,
            width: '200px',
        },

        // {
        //     name: 'Active Status',
        //     selector: row => (
        //         <div className="form-check form-switch form-check-info">
        //             <input
        //                 id={`rating_${row.clientDetails.ActiveStatus}`}
        //                 className="form-check-input toggleswitch"
        //                 type="checkbox"
        //                 defaultChecked={row.clientDetails.ActiveStatus == 1}
        //                 onChange={(event) => handleSwitchChange(event, row._id)}
        //             />
        //             <label
        //                 htmlFor={`rating_${row.clientDetails.ActiveStatus}`}
        //                 className="checktoggle checkbox-bg"
        //             ></label>
        //         </div>
        //     ),
        //     sortable: true,
        //     width: '165px',
        // },
        {
            name: 'CreatedAt',
            selector: row => fDateTime(row.clientDetails?.createdAt),
            sortable: true,
            width: '220px',
        },
        {
            name: 'Actions',
            selector: (row) => (
                <>
                    {/* <Tooltip placement="top" overlay="Kyc Agreement">

                        {row.clientDetails?.kyc_verification === "1" ? <Download onClick={() => handleDownload(row)} /> : ""}

                    </Tooltip> */}
                    <Tooltip placement="top" overlay="Package Assign">
                        <span onClick={(e) => { showModal(true); setClientid(row); getplanlistassinstatus(row._id) }} style={{ cursor: 'pointer' }}>
                            <Settings2 style={{ color: "orange" }} />
                        </span>
                    </Tooltip>

                    <Tooltip title="Update">
                        <SquarePen className='ms-2' onClick={() => updateClient(row)} style={{ color: "#6f42c1" }} />
                    </Tooltip>
                    {/* <Tooltip title="delete">
                        <Trash2 onClick={() => DeleteClient(row._id)} />

                    </Tooltip> */}
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '165px',
        }
    ];




    return (
        <div>
            <div>
                <div>
                    <div className="page-content">
                        <div className="page-breadcrumb  d-flex align-items-center mb-3 ">
                            <div className="breadcrumb-title pe-3">{header}</div>
                            <div className="ps-3">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb mb-0 p-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/admin/dashboard">
                                                <i className="bx bx-home-alt" />
                                            </Link>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <hr />
                        <div className="card">
                            <div className="card-body">
                                <div className="d-sm-flex align-items-center mb-4 gap-3 justify-content-between">
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control ps-5 radius-10"
                                            placeholder="Search free  Client"
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            value={searchInput}
                                        />
                                        <span className="position-absolute top-50 product-show translate-middle-y">
                                            <i className="bx bx-search" />
                                        </span>
                                    </div>

                                    <div
                                        className="ms-0 ms-sm-2 mt-2 mt-sm-0"
                                        onClick={(e) => getexportfile()}
                                    >
                                        <button
                                            type="button"
                                            className="btn btn-primary float-sm-end"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Export To Excel"
                                            delay={{ show: "0", hide: "100" }}

                                        >
                                            <i className="bx bxs-download" aria-hidden="true"></i>

                                            Export-Excel
                                        </button>
                                    </div>



                                </div>
                                <div>
                                    {isLoading ? (
                                        <Loader />
                                    ) : (
                                        <>

                                            <Table
                                                columns={columns}
                                                data={clients}
                                                totalRows={totalRows}
                                                currentPage={currentPage}
                                                onPageChange={handlePageChange}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <ReusableModal
                show={isModalVisible}
                onClose={() => handleCancel()}
                title={<> Assign Package</>}
                size="xl"
                body={
                    <>
                        <div className="card">
                            <div className="d-flex justify-content-center align-items-center card-body">
                                {["Plan", "Basket"].map((tab, index) => (
                                    <label key={index} className="labelfont mx-3">
                                        <input
                                            style={{ marginLeft: "12px" }}
                                            type="radio"
                                            name="tab"
                                            checked={checkedIndex === index}
                                            onChange={() => handleTabChange(index)}
                                            aria-label={`Select ${tab}`}
                                        />
                                        <span className="ps-2 text-secondary">{tab}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            {checkedIndex === 0 && (
                                <>
                                    <div className="row my-3">
                                        {category &&
                                            category
                                                .filter((cat) =>
                                                    planlist.some((plan) => plan.category._id === cat._id)
                                                )
                                                .map((item, index) => (
                                                    <div className="col-lg-4 mb-3" key={index}>
                                                        <input
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                margin: "0 8px",
                                                            }}
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="planSelection"
                                                            id={`proplus-${index}`}
                                                            onClick={() => handleCategoryChange(item._id)}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={`proplus-${index}`}
                                                            style={{
                                                                fontSize: "14px",
                                                                fontWeight: "600",
                                                                color: "#333",
                                                            }}
                                                        >
                                                            {item.title} (
                                                            {item.servicesDetails
                                                                .map((service) => service.title)
                                                                .join(", ")}
                                                            )
                                                        </label>
                                                    </div>
                                                ))}
                                    </div>

                                    {selectcategory && (
                                        <form
                                            className="card-body my-3"
                                            style={{ height: "40vh", overflowY: "scroll" }}
                                        >
                                            <div className="row">
                                                {planlist
                                                    .filter(
                                                        (item) => item.category._id === selectcategory
                                                    )
                                                    .map((item, index) => (
                                                        <div className="col-md-6 mb-3" key={index}>
                                                            <div className="card mb-0 shadow-sm">
                                                                <div className="card-body p-2">
                                                                    <h5 className="card-title d-flex align-items-center">
                                                                        <input
                                                                            style={{
                                                                                height: "13px",
                                                                                width: "13px",
                                                                                marginTop: "0.52rem",
                                                                                border: "1px solid #ddd",
                                                                            }}
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            name="planSelection"
                                                                            id={`input-plan-${index}`}
                                                                            checked={selectedPlanId === item._id}
                                                                            onClick={() => {
                                                                                setSelectedPlanId(item._id);
                                                                                setUpdatetitle({
                                                                                    plan_id: item._id,
                                                                                    price: item.price,
                                                                                });
                                                                            }}
                                                                        />
                                                                        <label
                                                                            className="form-check-label mx-2"
                                                                            style={{
                                                                                fontSize: "14px",
                                                                                fontWeight: "700",
                                                                                color: "#333",
                                                                            }}
                                                                            htmlFor={`input-plan-${index}`}
                                                                        >
                                                                            {item.validity}
                                                                        </label>
                                                                    </h5>

                                                                    <div
                                                                        className="accordion"
                                                                        id={`accordion-${selectcategory}`}
                                                                    >
                                                                        <div className="accordion-item">
                                                                            <h2
                                                                                className="accordion-header"
                                                                                id={`heading-${item._id}`}
                                                                            >
                                                                                <button
                                                                                    className={`accordion-button ${selectedPlanId === item._id
                                                                                        ? ""
                                                                                        : "collapsed"
                                                                                        } custom-accordion-button`}
                                                                                    type="button"
                                                                                    data-bs-toggle="collapse"
                                                                                    data-bs-target={`#collapse-${item._id}`}
                                                                                    aria-expanded={
                                                                                        selectedPlanId === item._id
                                                                                    }
                                                                                    aria-controls={`collapse-${item._id}`}
                                                                                >
                                                                                    <div className="d-flex justify-content-between w-100">
                                                                                        <div>
                                                                                            <strong className="text-secondary m-2">
                                                                                                Detail
                                                                                            </strong>
                                                                                            <strong className="text-success m-2 activestrong">
                                                                                                {item?.subscription?.status ===
                                                                                                    "active"
                                                                                                    ? "Active"
                                                                                                    : ""}
                                                                                            </strong>
                                                                                        </div>
                                                                                    </div>
                                                                                </button>
                                                                            </h2>
                                                                            <div
                                                                                id={`collapse-${item._id}`}
                                                                                className={`accordion-collapse collapse ${selectedPlanId === item._id
                                                                                    ? "show"
                                                                                    : ""
                                                                                    }`}
                                                                                aria-labelledby={`heading-${item._id}`}
                                                                                data-bs-parent={`#accordion-${selectcategory}`}
                                                                            >
                                                                                <div className="accordion-body">
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <strong>Price:</strong>
                                                                                        <span>
                                                                                            <IndianRupee /> {item.price}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <strong>Validity:</strong>
                                                                                        <span>{item.validity}</span>
                                                                                    </div>
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <strong>Created At:</strong>
                                                                                        <span>
                                                                                            {fDateTime(item.created_at)}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <strong>Updated At:</strong>
                                                                                        <span>
                                                                                            {fDateTime(item.updated_at)}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}

                            {checkedIndex === 1 && (
                                <>
                                    <div
                                        className="card-body my-3"
                                        style={{ height: "40vh", overflowY: "scroll" }}
                                    >
                                        <div className="row">
                                            {getBasket.map((item, index) => (
                                                <div className="col-md-6 mb-3" key={index}>
                                                    <div className="card mb-0 shadow-sm">
                                                        <div className="card-body p-2">
                                                            <h5 className="card-title d-flex align-items-center">
                                                                <input
                                                                    style={{
                                                                        height: "13px",
                                                                        width: "13px",
                                                                        marginTop: "0.52rem",
                                                                        border: "1px solid #ddd",
                                                                    }}
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="planSelection"
                                                                    id={`input-plan-${index}`}
                                                                    checked={selectedPlanId === item._id}
                                                                    onClick={() => {
                                                                        setSelectedPlanId(item._id);
                                                                        setBasketdetail({
                                                                            basket_id: item._id,
                                                                            price: item.basket_price,
                                                                        });
                                                                    }}
                                                                />
                                                                <label
                                                                    className="form-check-label mx-2"
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "700",
                                                                        color: "#333",
                                                                    }}
                                                                    htmlFor={`input-plan-${index}`}
                                                                >
                                                                    {item.title} ({item.themename})
                                                                </label>
                                                            </h5>

                                                            <div
                                                                className="accordion"
                                                                id={`accordion-basket`}
                                                            >
                                                                <div className="accordion-item">
                                                                    <h2
                                                                        className="accordion-header"
                                                                        id={`heading-${item._id}`}
                                                                    >
                                                                        <button
                                                                            className={`accordion-button ${selectedPlanId === item._id
                                                                                ? ""
                                                                                : "collapsed"
                                                                                } custom-accordion-button`}
                                                                            type="button"
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target={`#collapse-${item._id}`}
                                                                            aria-expanded={
                                                                                selectedPlanId === item._id
                                                                            }
                                                                            aria-controls={`collapse-${item._id}`}
                                                                        >
                                                                            <div className="d-flex justify-content-between w-100">
                                                                                <div>
                                                                                    <strong className="text-secondary m-2">
                                                                                        Detail
                                                                                    </strong>
                                                                                    <strong className="text-success m-2 activestrong">
                                                                                        {item?.subscription?.status ===
                                                                                            "active"
                                                                                            ? "Active"
                                                                                            : ""}
                                                                                    </strong>
                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    </h2>
                                                                    <div
                                                                        id={`collapse-${item._id}`}
                                                                        className={`accordion-collapse collapse ${selectedPlanId === item._id ? "show" : ""
                                                                            }`}
                                                                        aria-labelledby={`heading-${item._id}`}
                                                                        data-bs-parent={`#accordion-basket`}
                                                                    >
                                                                        <div className="accordion-body">
                                                                            <div className="d-flex justify-content-between">
                                                                                <strong>Price:</strong>
                                                                                <span>
                                                                                    <IndianRupee /> {item.basket_price}
                                                                                </span>
                                                                            </div>
                                                                            <div className="d-flex justify-content-between">
                                                                                <strong>Validity:</strong>
                                                                                <span>{item.validity}</span>
                                                                            </div>
                                                                            <div className="d-flex justify-content-between">
                                                                                <strong>
                                                                                    Minimum Investment Amount:
                                                                                </strong>
                                                                                <span>
                                                                                    <IndianRupee /> {item?.mininvamount}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                }
                footer={
                    <>
                        <button
                            className="btn btn-primary rounded-1"
                            onClick={() => handleCancel()}
                        >
                            Cancel
                        </button>
                        {checkedIndex === 0 && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => Updateplansubscription()}
                            >
                                Save Plan
                            </button>
                        )}
                        {checkedIndex === 1 && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => UpdateBasketservice()}
                            >
                                Save Plan
                            </button>
                        )}
                    </>
                }
            />
        </div>
    );
}

export default Freeclient;
