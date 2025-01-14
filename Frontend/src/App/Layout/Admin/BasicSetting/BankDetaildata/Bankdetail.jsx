import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from '../../../../Extracomponents/Table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { BankDetailListbyadmin, BankStatusdetail, DeleteBankDetail } from '../../../../Services/Admin/Admin';
import { image_baseurl } from '../../../../../Utils/config';
import { Tooltip } from 'antd';
import { fDateTime } from '../../../../../Utils/Date_formate';



const Bankdetail = () => {


    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [viewpage, setViewpage] = useState({});
    const [datewise, setDatewise] = useState("")

    const token = localStorage.getItem('token');



    const getBankData = async () => {
        try {
            const response = await BankDetailListbyadmin(token);
            if (response.status) {
                const filterdata = response.data.filter((item) =>
                    searchInput === "" ||
                    item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.branch.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.accountno.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.ifsc.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.ifsc.toLowerCase().includes(searchInput.toLowerCase())
                );
                setClients(searchInput ? filterdata : response.data);
                setDatewise(response.data)
                // setClients(response.data);
            }
        } catch (error) {
            console.log("error");
        }
    }




    useEffect(() => {
        getBankData();
    }, [searchInput]);




    const updatebankdetaildata = async (row) => {
        navigate("/admin/updatebankdetail/" + row._id, { state: { row } })
    }


    const Deletedetailbyadmin = async (_id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this bank detail? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
            });

            if (result.isConfirmed) {
                const response = await DeleteBankDetail(_id, token);
                if (response.status) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The Details has been successfully deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    getBankData();

                }
            } else {

                Swal.fire({
                    title: 'Cancelled',
                    text: 'The Details deletion was cancelled.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the details.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });

        }
    };





    // update status 

    const handleSwitchChange = async (event, id) => {

        const user_active_status = event.target.checked === true ? "true" : "false"
        const data = { id: id, status: user_active_status }
        const result = await Swal.fire({
            title: "Do you want to save the changes?",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
        });

        if (result.isConfirmed) {
            try {
                const response = await BankStatusdetail(data, token)
                if (response.status) {
                    Swal.fire({
                        title: "Saved!",
                        icon: "success",
                        timer: 1000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        Swal.close();
                    }, 1000);
                }
                getBankData();
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error processing your request.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            getBankData();
        }
    };





    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Image',
            cell: row => <img src={`${image_baseurl}/uploads/bank/${row.image}`} alt="Image" width="50" height="50" />,
            sortable: true,
            width: '110px',
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Branch Name',
            selector: row => row.branch,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Account Number',
            selector: row => row.accountno,
            sortable: true,
            width: '200px',
        },
        {
            name: 'IFSC Code',
            selector: row => row.ifsc,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Active Status',
            selector: row => {

                return (
                    <div className="form-check form-switch form-check-info">
                        <input
                            id={`rating_${row.status}`}
                            className="form-check-input toggleswitch"
                            type="checkbox"
                            defaultChecked={row.status === true}
                            onChange={(event) => handleSwitchChange(event, row._id)}
                        />
                        <label
                            htmlFor={`rating_${row.status}`}
                            className="checktoggle checkbox-bg"
                        ></label>
                    </div>
                );
            },
            sortable: true,
            width: '156px',
        },
        {
            name: 'Actions',
            cell: row => {
                const currentDate = new Date();
                const endDate = new Date(row.enddate);

                return (
                    <>
                        {currentDate > endDate ? (
                            <span className="text-danger" >-</span>
                        ) : (
                            <div className='d-flex' >
                                <div >
                                    {/* <Tooltip placement="top" overlay="View">
                                        <Eye
                                            style={{ marginRight: "10px" }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#example2"
                                        onClick={() => setViewpage(row)}
                                        />
                                    </Tooltip> */}
                                </div>
                                <div>
                                    <Tooltip placement="top" overlay="Edit">
                                        <Pencil onClick={() => updatebankdetaildata(row)} />
                                    </Tooltip>
                                </div>
                                <div>
                                    <Tooltip placement="top" overlay="Delete">
                                        <Trash2 onClick={() => Deletedetailbyadmin(row._id)} />
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

    ];

    return (
        <div>
            <div>
                <div className="page-content">
                    <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">Bank Detail</div>
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
                                        placeholder="Search Detail"
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        value={searchInput}
                                    />
                                    <span className="position-absolute top-50 product-show translate-middle-y">
                                        <i className="bx bx-search" />
                                    </span>
                                </div>
                                <div className="ms-auto">
                                    <Link
                                        to="/admin/addbankdetail"
                                        className="btn btn-primary"
                                    >
                                        <i
                                            className="bx bxs-plus-square"
                                            aria-hidden="true"
                                        />
                                        Add Bank
                                    </Link>
                                </div>
                            </div>

                            <Table
                                columns={columns}
                                data={clients}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bankdetail;
