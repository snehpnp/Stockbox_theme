import React, { useEffect, useState } from 'react'
import { getDashboarddetail, getExpiryByMonth } from '../../../Services/Admin/Admin'
import { GetClient } from '../../../Services/Admin/Admin';
import { fDateTime, fDateMonth } from '../../../../Utils/Date_formate';
import Table from '../../../Extracomponents/Table';
import { getstaffperuser } from '../../../Services/Admin/Admin';
import { Link } from 'react-router-dom';
import Loader from '../../../../Utils/Loader';





const Dashbord = () => {



    useEffect(() => {
        getpermissioninfo()
    }, [])




    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');

    const [permission, setPermission] = useState([]);


    // state for loader
    const [isLoader, setIsLoader] = useState(true)


    const getpermissioninfo = async () => {
        try {
            const response = await getstaffperuser(userid, token);
            if (response.status) {
                console.log("response.data", response.data)
                setPermission(response.data);
            }
        } catch (error) {
            console.log("error", error);
        }
        setIsLoader(false)
    };



    return (
        <>
            <div className="page-content">

                <div className="page-breadcrumb  mb-3">
                    <div
                        style={{

                            padding: "30px",

                        }}
                    >
                        {/* Accent Header Bar */}


                        {/* Avatar + Name */}
                        <div style={{ display: "flex", alignItems: "center", }}>
                            <div
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: "60px",
                                    height: "60px",
                                    fontSize: "22px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "20px",
                                }}
                            >
                                {permission?.FullName?.[0] || "U"}
                            </div>
                            <div>
                                <h2 style={{ margin: "0", fontSize: "22px", color: "#333" }}>{permission?.FullName || "N/A"}</h2>
                                <p style={{ margin: "4px 0", color: "#777" }}>{permission?.Role == 2 ? "EMPLOYEE" : ""}</p>
                            </div>
                        </div>
                        <hr />
                        {/* Profile Details */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
                            <div style={{ flex: "1 1 30%" }}>
                                <span style={{ color: "#555", fontWeight: "600" }}> Username: </span>
                                {permission?.UserName || "N/A"}
                            </div>
                            <div style={{ flex: "1 1 30%" }}>
                                <span style={{ color: "#555", fontWeight: "600" }}> Email: </span>
                                {permission?.Email || "N/A"}
                            </div>
                            <div style={{ flex: "1 1 30%" }}>
                                <span style={{ color: "#555", fontWeight: "600" }}> Phone: </span>
                                {permission?.PhoneNo || "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="d-lg-flex align-items-center mb-4 gap-3">

                            <div style={{ padding: "30px" }}>
                                {isLoader ? (
                                    <Loader />
                                ) : (
                                    <>



                                        {/* Permissions Section */}
                                        <div

                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                                <h2 style={{ color: "#333", margin: "0" }}>🛡️ Permissions</h2>
                                            </div>
                                            <hr />
                                            {permission?.permissions.length > 0 ? (
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                                    {permission?.permissions
                                                        ?.filter((perm) => perm !== "userPermissions" && perm !== "planpermission")
                                                        .map((perm, index) => (
                                                            <span
                                                                className="permission-badge"
                                                                key={index}

                                                            >
                                                                {perm}
                                                            </span>
                                                        ))}

                                                </div>
                                            ) : (
                                                <p style={{ color: "#999" }}>No permissions assigned</p>
                                            )}
                                        </div>

                                    </>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </>
    );




}

export default Dashbord
