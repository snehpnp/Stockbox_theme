import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Table from '../../../components/Table';
import { Tooltip } from 'antd';
import { getExpiryByMonth} from '../../../Services/Admin';
import { fDate, fDateTime  , fDateMonth} from '../../../Utils/Date_formate';




const Planexpirymonth = () => {
    
    const { id } = useParams();
    const token = localStorage?.getItem('token');

    const [data, setData] = useState([]);
   

    useEffect(() => {
        getclientservice()
    }, []);



    
    const getclientservice = async () => {
        try {
            const response = await getExpiryByMonth(token);
            if (response.status) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Error fetching client details:", error);
        }
    };

   


    const columns = [
        {
            name: 'S.No',
            selector: (row, index) =>  index + 1,
            sortable: false,
            width: '200px',
        },
        {
            name: 'No Of License',
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
        // {
        //     name: 'Created_At',
        //     selector: row => fDateTime(row.created_at),
        //     sortable: true,
        //     width: '300px',
        // },

        // {
        //     name: 'Purchase Date',
        //     selector: row => fDateTime(row.plan_start),
        //     width: '180px'
        // },
        // {
        //     name: 'Expiry Date',
        //     selector: row => fDateTime(row.plan_end),
        //     width: '180px'
        // },
    ];




    return (
        <div>
            <div className="page-content">
                <div className="row">
                    <div className="col-md-6">
                        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                            <div className="breadcrumb-title pe-3">Expiry Month</div>
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
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <Table columns={columns} data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planexpirymonth;
