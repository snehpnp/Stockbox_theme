
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GetDayExpirydata } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import Content from '../../../components/Contents/Content';



const YesterdayExpirydata = () => {

    const location = useLocation()
    const item = location?.state?.clientStatus



    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");




    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');


    const resethandle = () => {
        setSearchInput("")

    }


    const gethistory = async () => {
        try {
            const data = { dayOffset: item }
            const response = await GetDayExpirydata(data, token);
            if (response.status) {
                console.log("response.data", response.clients)
                let filteredData = response.clients;
                setClients(filteredData);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };



    useEffect(() => {
        gethistory();
    }, [searchInput]);


    const columns = [

        {
            name: 'Name',
            selector: row => row.FullName,
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
            name: 'Phone',
            selector: row => row.PhoneNo,
            sortable: true,
            width: '200px',
        },

        {
            name: 'Plan Name',
            selector: row => row?.planName,
            sortable: true,
            width: '200px',
        },



    ];



    return (
        <Content
            Page_title="Today Expiry Details"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >

            <div>
                <div className="card">
                    <div className="card-body">
                        <div className="d-sm-flex align-items-center mb-4 gap-3 justify-content-between">

                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5 radius-10"
                                    placeholder="Search "
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    value={searchInput}
                                />
                                <span className="position-absolute top-50 product-show translate-middle-y">
                                    <i className="bx bx-search" />
                                </span>

                            </div>


                            <div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                data={clients}

                            />
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default YesterdayExpirydata;

