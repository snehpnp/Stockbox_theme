import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getcouponlist } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { Eye, Pencil, Trash2, IndianRupee } from 'lucide-react';
import { DeleteCoupon, UpdateClientStatus, CouponStatus, CouponShowstatus, GetService } from '../../../Services/Admin/Admin';
import { image_baseurl } from '../../../../Utils/config';
import { Tooltip } from 'antd';
import { fDate, fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader';
import ReusableModal from '../../../components/Models/ReusableModal';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';



const Coupon = () => {


    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [viewpage, setViewpage] = useState({});
    const [datewise, setDatewise] = useState("")

    const [service, setService] = useState([])


    //state for Loading
    const [isLoading, setIsLoading] = useState(true)


    const [showModal, setShowModal] = useState(false);



    const token = localStorage.getItem('token');



    const getcoupon = async () => {
        try {
            const response = await getcouponlist(token);


            if (response.status) {
                const filterdata = response.data.filter((item) =>
                    searchInput === "" ||
                    item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.code.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchInput.toLowerCase())
                );
                setClients(searchInput ? filterdata : response.data);
                setDatewise(response.data)
                // setClients(response.data);
            }
        } catch (error) {
            console.log("error");
        }

        setIsLoading(false)

    }

    const getService = async () => {
        try {
            const response = await GetService(token);
            // console.log("response",response);

            if (response.status) {
                setService(response.data)
                // console.log("chaking",response.data);

            }
        } catch (error) {
            console.log("error");
        }
    }




    useEffect(() => {
        getcoupon();
        getService();
    }, [searchInput]);




    const updatecoupon = async (row) => {
        navigate("/admin/coupon/updatecoupon/" + row._id, { state: { row } })
    }

    const DeleteCouponbyadmin = async (_id) => {
        try {
            const result = await showCustomAlert("confirm", 'Do you want to delete this coupon This action cannot be undone.')

            if (result) {
                const response = await DeleteCoupon(_id, token);
                if (response.status) {
                    showCustomAlert("Success", 'The Coupon has been successfully deleted.')
                    getcoupon();

                }
            } else {
                showCustomAlert("error", 'The coupon deletion was cancelled.')
            }
        } catch (error) {
            showCustomAlert("error", 'There was an error deleting the coupon.')
        }
    };





    // update status 
    const handleSwitchChange = async (event, id) => {

        const user_active_status = event.target.checked === true ? "true" : "false"

        const data = { id: id, status: user_active_status }
        const result = await showCustomAlert("confirm", "Do you want to save the changes?")

        if (result) {
            try {
                const response = await CouponStatus(data, token)
                if (response.status) {
                    showCustomAlert("Success", 'Changed status')
                }
                getcoupon();
            } catch (error) {
                showCustomAlert("error", "There was an error processing your request.")
            }
        } else {
            event.target.checked = !event.target.checked
            getcoupon();
        }
    };



    const handleSwitchChange1 = async (event, id) => {

        const user_active_status = event.target.checked === true ? "1" : "0"
        const data = { id: id, status: user_active_status }

        const result = await showCustomAlert("confirm", "Do you want to save the changes?")
        if (result) {
            try {
                const response = await CouponShowstatus(data, token)
                if (response.status) {
                    showCustomAlert("Success", 'Changed status')
                }
                getcoupon();
            } catch (error) {
                showCustomAlert("error", "There was an error processing your request.")
            }
        } else {
            event.target.checked = !event.target.checked
            getcoupon();
        }
    };



    const columns = [
        // {
        //     name: 'S.No',
        //     selector: (row, index) => index + 1,
        //     sortable: false,
        //     width: '100px',
        // },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Code',
            selector: row => row.code,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Fixed/Percent Value',
            selector: row => row.type === "fixed" ? row.value : `${row.value}`,
            sortable: true,
            width: '220px',
        },
        {
            name: 'Used Limit/Total Limit',
            selector: row => {
                const usedLimit = row.totallimitation - row.limitation;
                return `${usedLimit} / ${row.totallimitation}`;
            },
            sortable: true,
            width: '250px',

        },
        {
            name: 'Services',
            selector: row => {
                // Service data ko check karte hain aur relevant data dikhate hain
                const serviceItem = service.find(item => item._id === row.service); // Assumed that coupon has serviceId
                return (
                    <div>{serviceItem ? serviceItem.title : 'All'}</div> // Show service name if found
                );
            },
            sortable: true,
            width: '150px',
        },
        // {
        //     name: 'Image',
        //     cell: row => <img src={`${image_baseurl}/uploads/coupon/${row.image}`} alt="Image" width="50" height="50" />,
        //     sortable: true,
        //     width: '110px',
        // },
        {
            name: 'Min Purchase Value',
            selector: row => <div> <IndianRupee />{row.minpurchasevalue}</div>,
            sortable: true,
            width: '210px',
        },
        {
            name: 'Max Discount Value',
            selector: row => <div> <IndianRupee />{row.mincouponvalue ? row.mincouponvalue : "-"}</div>,
            sortable: true,
            width: '210px',
        },

        // {
        //     name: 'Description',
        //     selector: row => row.description,
        //     sortable: true,
        //     width: '180px',
        // },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
            width: '120px',
        },

        {
            name: 'Active Status',
            selector: row => {
                const currentDate = new Date();
                const endDate = new Date(row.enddate);
                endDate.setHours(23, 59, 59, 999);
                if (currentDate > endDate) {
                    return <span className="text-danger" style={{ color: "red" }}>Expired</span>;
                    // } else {
                    //     return (
                    //         <div className="form-check form-switch form-check-info">
                    //             <input
                    //                 id={`rating_${row.status}`}
                    //                 className="form-check-input toggleswitch"
                    //                 type="checkbox"
                    //                 defaultChecked={row.status === true}
                    //                 onChange={(event) => handleSwitchChange(event, row._id)}
                    //             />
                    //             <label
                    //                 htmlFor={`rating_${row.status}`}
                    //                 className="checktoggle checkbox-bg"
                    //             ></label>
                    //         </div>
                    //     );
                    // }
                } else {
                    return <span className="text-success" style={{ color: "green" }}>Active</span>;
                }
            },
            sortable: true,
            width: '156px',
        },
        {
            name: 'Show Status',
            selector: row => {
                const currentDate = new Date();
                const endDate = new Date(row.enddate);
                endDate.setHours(23, 59, 59, 999);
                if (currentDate > endDate) {
                    return <span className="text-danger" style={{ color: "red" }}>Expired</span>;
                } else {
                    return (
                        <div className="form-check form-switch form-check-info">
                            <input
                                id={`rating_${row._id}`}
                                className="form-check-input toggleswitch"
                                type="checkbox"
                                checked={row.showstatus === 1}
                                onChange={(event) => handleSwitchChange1(event, row._id)}
                            />
                            <label
                                htmlFor={`rating_${row._id}`}
                                className="checktoggle checkbox-bg"
                            ></label>
                        </div>
                    );
                }
            },

            sortable: true,
            width: '156px',
        },
        {
            name: 'Start date',
            selector: row => fDateTime(row.startdate),
            sortable: true,
            width: '200px',
        },
        {
            name: 'End date',
            selector: row => fDateTime(row.enddate),
            sortable: true,
            width: '200px',
        },

        {
            name: 'Actions',
            cell: row => {
                const currentDate = new Date();
                const endDate = new Date(row.enddate);
                endDate.setHours(23, 59, 59, 999);
                return (
                    <>
                        {currentDate > endDate ? (
                            <span className="text-danger" >-</span>
                        ) : (
                            <div className='d-flex' >
                                <div >
                                    <Tooltip placement="top" overlay="View">
                                        <Eye
                                            style={{ marginRight: "10px" }}

                                            onClick={() => { setShowModal(true); setViewpage(row) }}
                                        />
                                    </Tooltip>
                                </div>
                                <div>
                                    <Tooltip placement="top" overlay="Edit">
                                        <Pencil onClick={() => updatecoupon(row)} />
                                    </Tooltip>
                                </div>
                                <div>
                                    <Tooltip placement="top" overlay="Delete">
                                        <Trash2 onClick={() => DeleteCouponbyadmin(row._id)} />
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                    </>
                );
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }

    ]

    return (
        <div>
            <div>
                <div className="page-content">
                    <div className="page-breadcrumb  d-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">Coupon</div>
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
                            <div className="d-lg-flex align-items-center mb-4 gap-3">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control ps-5 radius-10"
                                        placeholder="Search Coupon"
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        value={searchInput}
                                    />
                                    <span className="position-absolute top-50 product-show translate-middle-y">
                                        <i className="bx bx-search" />
                                    </span>
                                </div>
                                <div className="ms-auto">
                                    <Link
                                        to="/admin/addcoupon"
                                        className="btn btn-primary"
                                    >
                                        <i
                                            className="bx bxs-plus-square"
                                            aria-hidden="true"
                                        />
                                        Add Coupon
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : clients.length > 0 ? (
                    <>

                        <Table
                            columns={columns}
                            data={clients}
                        />
                    </>
                ) : (
                    <div className="text-center mt-5">
                        <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                    </div>
                )}
                {/* // ReusableModal usage */}
                <ReusableModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    title={<>
                        Coupon Details
                    </>}
                    body={
                        <>
                            <ul className="list-group">
                                <div>
                                    <strong>Name:</strong> <span>{viewpage?.name || "N/A"}</span>
                                </div>
                                <div>
                                    <strong>Code:</strong> <span>{viewpage?.code || "N/A"}</span>
                                </div>
                                <div>
                                    <strong>Min Purchase Value:</strong> <span>{viewpage?.minpurchasevalue || "N/A"}</span>
                                </div>
                                <div >
                                    <strong>Max Discount Value:</strong> <span>{viewpage?.mincouponvalue || "N/A"}</span>
                                </div>
                                <div>
                                    <strong>Start Date:</strong>
                                    <span>{viewpage?.startdate ? fDateTime(viewpage.startdate) : "Not available"}</span>
                                </div>
                                <div>
                                    <strong>End Date:</strong>
                                    <span>{viewpage?.enddate ? fDateTime(viewpage.enddate) : "Not available"}</span>
                                </div>
                            </ul>
                        </>
                    }
                    footer={
                        <>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </>
                    }
                />


            </div>
        </div>
    )
}

export default Coupon;
