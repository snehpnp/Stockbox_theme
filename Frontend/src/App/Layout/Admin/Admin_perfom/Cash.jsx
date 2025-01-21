import React, { useEffect, useState } from 'react'
import { getDashboarddetail } from '../../../Services/Admin'
import { GetClient } from '../../../Services/Admin';
import { fDateTime } from '../../../Utils/Date_formate';
import Table from '../../../components/Table';
import { Link } from 'react-router-dom';


const Cash = () => {

    const token = localStorage.getItem('token');

    const [data, setData] = useState([])
    const [clients, setClients] = useState([]);


    const getdetail = async () => {
        try {
            const response = await getDashboarddetail(token);
            if (response.status) {

                setData(response.data)
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };



    const getAdminclient = async () => {
        try {
            const response = await GetClient(token);
            if (response.status) {
                const topClients = response.data.slice(0, 5);
                setClients(topClients);
            }
        } catch (error) {
            console.log("error");
        }
    }

    useEffect(() => {
        getdetail()
        getAdminclient()
    }, [])



    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Stock Name',
            selector: row => row.FullName,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Entry Type',
            selector: row => row.Email,
            sortable: true,
            width: '400px',

        },
        {
            name: 'Entry Date',
            selector: row => row.PhoneNo,
            sortable: true,
            width: '200px',
        },



        {
            name: 'Entry Price',
            selector: row => fDateTime(row.createdAt),
            sortable: true,

        },
        {
            name: 'Exit Date',
            selector: row => fDateTime(row.createdAt),
            sortable: true,

        },
        {
            name: 'Exit Price',
            selector: row => fDateTime(row.createdAt),
            sortable: true,

        },

        {
            name: 'Net Gain/ Loss',
            selector: row => fDateTime(row.createdAt),
            sortable: true,


        },
        {
            name: 'Discription',
            selector: row => fDateTime(row.createdAt),
            sortable: true,

        },

    ];



    return (
        <div>

            <div className="page-content">

                <div className="card radius-10">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h5 className="mb-0">Cash</h5>
                            </div>
                            <div>
                                <h5 className="mb-0">Cash</h5>
                            </div>

                        </div>
                        <hr />

                        <div className="table-responsive d-flex justify-content-center">
                            <Table

                                columns={columns}
                                data={clients}
                            />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Cash
