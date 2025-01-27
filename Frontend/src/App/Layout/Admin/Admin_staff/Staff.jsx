import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GetStaff } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { Eye, Pencil, Trash2, UserCog } from 'lucide-react';
import { deleteStaff, updateStaffstatus } from '../../../Services/Admin/Admin';
import Swal from 'sweetalert2';
import { Tooltip } from 'antd';
import ExportToExcel from '../../../../Utils/ExportCSV';
import { fDate, fDateTime } from '../../../../Utils/Date_formate';
import io from 'socket.io-client';
import { soket_url } from '../../../../Utils/config';

const Staff = () => {

    const SOCKET_SERVER_URL = soket_url

    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [ForGetCSV, setForGetCSV] = useState([])
    const [searchInput, setSearchInput] = useState("");
    const [allsearchInput, setAllSearchInput] = useState([]);

    const token = localStorage.getItem('token');


    const getAdminclient = async () => {
        try {
            const response = await GetStaff(token);
            if (response.status) {
                setClients(response.data);
                setAllSearchInput(response.data)
            }
        } catch (error) {
            console.log("error");
        }
    }



    useEffect(() => {
        const filteredData = allsearchInput?.filter((item) =>
            !searchInput ||
            item?.FullName.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.UserName.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.Email.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.PhoneNo.toLowerCase().includes(searchInput.toLowerCase())
        );
        setClients(filteredData);
    }, [searchInput, allsearchInput]);




    useEffect(() => {
        getAdminclient();
    }, []);

    useEffect(() => {
        forCSVdata()
    }, [clients]);


    const forCSVdata = () => {
        if (clients?.length > 0) {
            const csvArr = clients.map((item) => ({
                FullName: item?.FullName,
                UserName: item?.UserName,
                Email: item?.Email || '',
                PhoneNo: item?.PhoneNo || '',
                CreatedAt: fDateTime(item.createdAt) || ""

            }));
            setForGetCSV(csvArr);
        }
    };


    // staff delete 

    const DeleteStaff = async (_id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this Employee member? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
            });

            if (result.isConfirmed) {
                const response = await deleteStaff(_id, token);
                socket.emit("deactivestaff", { id: _id, msg: "logout" });
                if (response.status) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The Employee has been successfully deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    getAdminclient();
                }
            } else {

                Swal.fire({
                    title: 'Cancelled',
                    text: 'The Employee deletion was cancelled.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the Employee.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });

        }
    };




    const updateStaff = async (row) => {
        navigate("/admin/staff/updatestaff/" + row._id, { state: { row } })
    }


    const updatepermission = async (row) => {
        navigate("/admin/staff/staffpermission/" + row._id, { state: { row } })
    }





    // update status

    const handleSwitchChange = async (event, id) => {

        const user_active_status = event.target.checked ? "1" : "0";
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
                const response = await updateStaffstatus(data, token)
                if (response.status) {

                    if (!event.target.checked) {

                        socket.emit("deactivestaff", { id: id, msg: "logout" });
                    }


                    Swal.fire({
                        title: "Saved!",
                        icon: "success",
                        timer: 1500,
                        timerProgressBar: true,
                    });

                    setTimeout(() => {
                        Swal.close();
                    }, 1500);
                }
                getAdminclient();
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error processing your request.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            event.target.checked = !event.target.checked
            // Swal.fire("Cancelled","No changes were made.","info")
            getAdminclient();
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
            name: 'Full Name',
            selector: row => row.FullName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'User Name',
            selector: row => row.UserName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Email',
            selector: row => row.Email,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Phone No',
            selector: row => row.PhoneNo,
            sortable: true,
            width: '142px',
        },
        {
            name: 'Active Status',
            selector: row => (
                <div className="form-check form-switch form-check-info">
                    <input
                        id={`rating_${row.ActiveStatus}`}
                        className="form-check-input toggleswitch"
                        type="checkbox"
                        defaultChecked={row.ActiveStatus === 1}
                        onChange={(event) => handleSwitchChange(event, row._id)}
                    />
                    <label
                        htmlFor={`rating_${row.ActiveStatus}`}
                        className="checktoggle checkbox-bg"
                    ></label>
                </div>
            ),
            sortable: true,
            width: '170px',
        },
        {
            name: 'Created At',
            selector: row => fDateTime(row.createdAt),
            sortable: true,
            width: '142px',
        },
        // {
        //     name: 'Updated At',
        //     selector: row => new Date(row.updatedAt).toLocaleDateString(),
        //     sortable: true,
        //     width: '142px',
        // },

        // {
        //     name: 'Permission',
        //     cell: row => (
        //         <>
        //             <div>
        //                 <UserPen onClick={() => updatepermission(row)} />
        //             </div>
        //         </>
        //     ),
        //     width: '142px',
        // },
        {
            name: 'Actions',
            cell: row => (
                < >


                    <div>
                        <Tooltip placement="top" overlay="Permision">
                            <UserCog onClick={() => updatepermission(row)} />
                        </Tooltip>
                    </div>

                    <div>
                        <Tooltip placement="top" overlay="Edit">
                            <Pencil onClick={() => updateStaff(row)} />
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip placement="top" overlay="Delete">
                            <Trash2 onClick={() => DeleteStaff(row._id)} />
                        </Tooltip>
                    </div>
                </>
            ),
        }

    ];


    return (
        <div>
            <div>
                <div>
                    <div className="page-content">

                        <div className="page-breadcrumb  d-flex align-items-center mb-3">
                            <div className="breadcrumb-title pe-3">Employee</div>
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
                                <div className="d-lg-flex align-items-center gap-3">
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control ps-5 radius-10"
                                            placeholder="Search Employee"
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            value={searchInput}
                                        />
                                        <span className="position-absolute top-50 product-show translate-middle-y">
                                            <i className="bx bx-search" />
                                        </span>
                                    </div>
                                    <div className="d-sm-flex gap-3 justify-content-lg-end w-100 mt-3 mt-lg-0">
                                    <div className="flaot-lg-end">
                                        <Link
                                            to="/admin/addstaff"
                                            className="btn btn-primary"
                                        >
                                            <i
                                                className="bx bxs-plus-square"
                                                aria-hidden="true"
                                            />
                                            Add Employee
                                        </Link>
                                    </div>
                                    <div className="ms-0 ms-sm-0 mt-2 mt-sm-0" >
                                        <ExportToExcel
                                            className="btn btn-primary "
                                            apiData={ForGetCSV}
                                            fileName={'All Users'} />

                                    </div>
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
        </div>
    )
}



export default Staff
