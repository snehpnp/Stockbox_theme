import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrokerResponsedata } from '../../../Services/UserService/User';
import Table from '../../../Extracomponents/Table';
import { RefreshCcw, IndianRupee } from 'lucide-react';
import Swal from 'sweetalert2';
import { fDateTime } from '../../../../Utils/Date_formate';
import Content from '../../../components/Contents/Content';




const BrokerReponse = () => {


    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');

    const [responsedata, setResponseData] = useState([])


    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);


    const getbrokerhistory = async () => {
        try {
            const data = { clientid: userid }
            const response = await BrokerResponsedata(data, token);
            if (response.status) {
                console.log("response?.data", response?.data)
                setResponseData(response?.data)
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };




    useEffect(() => {
        getbrokerhistory();
    }, []);




    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Email',
            selector: row => row?.Email,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Email',
            selector: row => row?.clientEmail,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Phone',
            selector: row => row?.clientPhoneNo,
            sortable: true,
            width: '200px',
        },



    ];


    return (

        <Content
            Page_title="Broker Response"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <div>

                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                data={responsedata}
                                totalRows={totalRows}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default BrokerReponse;
