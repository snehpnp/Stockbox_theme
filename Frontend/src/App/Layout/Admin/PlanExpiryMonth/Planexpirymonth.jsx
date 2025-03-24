import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from '../../../Extracomponents/Table';
import { Tooltip } from 'antd';
import { getExpiryByMonth } from '../../../Services/Admin/Admin';
import { fDate, fDateTime, fDateMonth } from '../../../../Utils/Date_formate';
import Content from '../../../components/Contents/Content';
import { Eye } from "lucide-react";


const Planexpirymonth = () => { 

    const token = localStorage?.getItem('token');
    const [data, setData] = useState([]);

    const navigate = useNavigate();



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


    const plandetail = async (row) => {
        navigate("/admin/planExpirymonthDetail", { state: { row } });
    };




    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => index + 1,
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
        {
            name: "Actions",
            selector: (row) => (
                <div className="d-flex justify-content-end gap-2 " >
                    <Tooltip title="view">
                        <Eye onClick={() => plandetail(row)}
                            style={{ color: "green" }} />
                    </Tooltip>
                </div>
            ),
            width: "165px",
        },
    ];




    return (
        <Content
            Page_title="Total Actice License"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <div>
                <div className="page-content">
                    <div className="card">
                        <div className="card-body">
                            <Table columns={columns} data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default Planexpirymonth;
