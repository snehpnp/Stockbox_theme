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
        <div style={{ padding: "30px", backgroundColor: "#f0f2f5", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
            {isLoader ? (
                <Loader />
            ) : (
                <>

                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            padding: "30px",
                            marginBottom: "40px",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                            position: "relative",
                        }}
                    >
                        {/* Accent Header Bar */}
                        <div style={{ height: "6px", width: "100px", backgroundColor: "#007bff", borderRadius: "4px", marginBottom: "20px" }}></div>

                        {/* Avatar + Name */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
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

                        {/* Profile Details */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
                            <div style={{ flex: "1 1 30%" }}>
                                <span style={{ color: "#555", fontWeight: "600" }}>👤 Username</span>
                                <p style={{ margin: "6px 0", color: "#222" }}>{permission?.UserName || "N/A"}</p>
                            </div>
                            <div style={{ flex: "1 1 30%" }}>
                                <span style={{ color: "#555", fontWeight: "600" }}>📧 Email</span>
                                <p style={{ margin: "6px 0", color: "#222" }}>{permission?.Email || "N/A"}</p>
                            </div>
                            <div style={{ flex: "1 1 30%" }}>
                                <span style={{ color: "#555", fontWeight: "600" }}>📞 Phone</span>
                                <p style={{ margin: "6px 0", color: "#222" }}>{permission?.PhoneNo || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            padding: "30px",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ color: "#333", margin: "0" }}>🛡️ Permissions</h2>
                        </div>

                        {permission?.permissions.length > 0 ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                {permission?.permissions
                                    ?.filter((perm) => perm !== "userPermissions || planpermission",) // Filter out the permission you want to ignore
                                    .map((perm, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                backgroundColor: "#17a2b8",
                                                color: "#fff",
                                                borderRadius: "20px",
                                                padding: "8px 16px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                            }}
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
    );




}

export default Dashbord
