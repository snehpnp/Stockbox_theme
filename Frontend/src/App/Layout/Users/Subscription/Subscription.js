import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../Extracomponents/Table";
import { getMySubscription } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";

const Subscription = () => {



    const [planData, setPlanData] = useState([]);

    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");





    const fetchMySubscription = async () => {
        try {
            const res = await getMySubscription(id, token);
            if (res?.status) {
                setPlanData(res.data);
            } else {
                setPlanData([]);
            }
        } catch (err) {
            setPlanData([]);
        }
    };

    useEffect(() => {
        fetchMySubscription();
    }, []);


    const columns = [
        {
            name: "Basket Name",
            selector: (row) => row.categoryDetails,
            sortable: true,
            width: '200px',
        },
        {
            name: "Title",
            selector: (row) => row.title,
        },
        {
            name: "Year",
            selector: (row) => row.year,
        },
    ];

    return (
        <div>
            <Content
                Page_title="Subscription"
                button_title="Add Basket"
                button_status={false}
                backbutton_title="Back"
                backbutton_status={false}>
                <div className="page-content">


                    {/* Cards Section */}
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card">
                                <ul className="list-group list-group-flush mt-0">
                                    <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                                        Cash<span></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Expiry Date<span className="badge bg-primary rounded-pill badgespan">28 Sep 2025</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <ul className="list-group list-group-flush mt-0">
                                    <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                                        Future<span></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Expiry Date<span className="badge bg-primary rounded-pill badgespan">28 Sep 2025</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <ul className="list-group list-group-flush mt-0">
                                    <li className="list-group-item d-flex justify-content-between align-items-center headingfont">
                                        Option<span></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Expiry Date<span className="badge bg-primary rounded-pill badgespan">28 Sep 2025</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    <div className="card">
                        <Table columns={columns} data={planData} />
                    </div>
                </div>


            </Content>
        </div>
    );
};

export default Subscription;