import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHelpMessagelist } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { Tooltip } from 'antd';
import { Eye } from 'lucide-react';
import { fDate, fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader';


const Help = () => {

    const token = localStorage.getItem('token');

    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    //state for Loading
    const [isLoading, setIsLoading] = useState(true)


    const getdemoclient = async () => {
        try {
            const response = await getHelpMessagelist(token);
            if (response.status) {

                const filterdata = response.data.filter((item) =>
                    searchInput === "" ||
                    item.clientDetails?.FullName.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.clientDetails?.Email.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.message?.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.subject?.toLowerCase().includes(searchInput.toLowerCase())
                );
                setClients(searchInput ? filterdata : response.data);
            }
        } catch (error) {
            console.log("error", error);
        }
        setIsLoading(false)

    }


    useEffect(() => {
        getdemoclient();

    }, [searchInput]);



    return (
        <div>
            <div>
                <div>
                    <div>
                        <div className="page-content">
                            <div className="page-breadcrumb  d-flex align-items-center mb-3">
                                <div className="breadcrumb-title pe-3">Help Message</div>
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
                                                placeholder="Search message"
                                                onChange={(e) => setSearchInput(e.target.value)}
                                                value={searchInput}
                                            />
                                            <span className="position-absolute top-50 product-show translate-middle-y">
                                                <i className="bx bx-search" />
                                            </span>
                                        </div>
                                    </div>

                                    {isLoading ? (
                                        <Loader/>
                                    ):(
                                        <>
                                        <div className="container ">
                                        <div className="row">
                                            <div className="col ">
                                                {clients.length > 0 ? (
                                                    clients.map((item) => (
                                                        <div key={item.id} className="card radius-15 mb-3">
                                                            <div className="card-body   position-relative">
                                                                <div className="p-2  radius-15">
                                                                    <div className="float-end text-muted">
                                                                        {fDateTime(item.created_at)}
                                                                    </div>
                                                                    <h4 className="card-title">{item.clientDetails?.FullName}</h4>
                                                                    <hr />
                                                                    <p>
                                                                        <strong>Email:</strong> {item.clientDetails?.Email}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Subject:</strong> {item?.subject}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Phone No:</strong> {item.clientDetails?.PhoneNo}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Description:</strong> {item?.message}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center mt-5">
                                                            <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                                                        </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                        </>
                                    )}
                                    
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Help;
