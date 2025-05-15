import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from '../../../Extracomponents/Table';
import Swal from 'sweetalert2';
import { CompanyDetailbyadmin } from '../../../Services/Superadmin/Admin';
import { fDateTime, fDateMonth, fDate } from '../../../../Utils/Date_formate';




const Companydetail = () => {

    const { id } = useParams()


    const token = localStorage.getItem('token');
    const navigate = useNavigate();


    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");



    useEffect(() => {
        getcompanydetail();
    }, [searchInput]);





    const getcompanydetail = async () => {
        try {
            const response = await CompanyDetailbyadmin(id, token);
            if (response.status) {
                const filterdata = response.data.filter((item) =>
                    searchInput === "" ||
                    item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.phone.toLowerCase().includes(searchInput.toLowerCase())

                );
                setClients(searchInput ? filterdata : response.data);
            }
        } catch (error) {
            console.log("error");
        }
    }







    const columns = [
        // {
        //     name: 'S.No',
        //     selector: (row, index) => index + 1,
        //     sortable: false,
        //     width: '100px',
        // },
        {
            name: 'Client',
            selector: row => row.noofclient,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Month',
            selector: row => fDateMonth(row.month),
            sortable: true,
            width: '300px',
        },
        {
            name: 'Created_At',
            selector: row => fDateTime(row.created_at),
            sortable: true,
            width: '300px',
        },

        // {
        //     name: 'Phone No',
        //     selector: row => row.phone,
        //     sortable: true,
        // },

        // {
        //     name: 'Active Status',
        //     selector: row => (
        //         <div className="form-check form-switch form-check-info">
        //             <input
        //                 id={`rating_${row.status}`}
        //                 className="form-check-input toggleswitch"
        //                 type="checkbox"
        //                 defaultChecked={row.status == true}
        //                 onChange={(event) => handleSwitchChange(event, row._id)}
        //             />
        //             <label
        //                 htmlFor={`rating_${row.status}`}
        //                 className="checktoggle checkbox-bg"
        //             ></label>
        //         </div>
        //     ),
        //     sortable: true,
        //     width: '165px',
        // },


    ];





    return (
        <div>
            <div>
                <div className="page-content">

                    <div className="page-breadcrumb  d-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">Company Dtail</div>
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
                                        placeholder="Search Client"
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        value={searchInput}
                                    />
                                    <span className="position-absolute top-50 product-show translate-middle-y">
                                        <i className="bx bx-search" />
                                    </span>
                                </div>
                                {/* <div className="ms-auto">
                                    <Link
                                        to="/admin/addcompany"
                                        className="btn btn-primary"
                                    >
                                        <i
                                            className="bx bxs-plus-square"
                                            aria-hidden="true"
                                        />
                                        Add Company
                                    </Link>
                                </div> */}
                            </div>


                            <Table
                                columns={columns}
                                data={clients}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div >


    );
}

export default Companydetail;
