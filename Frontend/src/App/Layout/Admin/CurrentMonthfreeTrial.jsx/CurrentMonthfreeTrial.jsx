import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from '../../../Extracomponents/Table';
import { Tooltip } from 'antd';
import { CurrentMonthfreeTrialdata } from '../../../Services/Admin/Admin';
import { fDate, fDateTime, fDateMonth } from '../../../../Utils/Date_formate';
import Content from '../../../components/Contents/Content';
import { Eye } from "lucide-react";


const CurrentMonthfreeTrial = () => {

    const token = localStorage?.getItem('token');
    const [data, setData] = useState([]);

    const navigate = useNavigate();



    useEffect(() => {
        getclientservice()
    }, []);




    const getclientservice = async () => {
        try {
            const response = await CurrentMonthfreeTrialdata(token);
            if (response) {
                setData(response);
            }
        } catch (error) {
            console.error("Error fetching client details:", error);
        }
    };


    const plandetail = async (row) => {
        navigate("/admin/freeTrial-detail", { state: { row } });
    };




    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '200px',
        },
        {
            name: 'Total',
            selector: row => row.total,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Month',
            selector: row => row.month,
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
            Page_title="Current Month Free Trial"
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

export default CurrentMonthfreeTrial;
