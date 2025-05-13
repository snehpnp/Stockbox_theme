import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SendBroadCast, GetService, getBroadCastmessage, ChangeBroadCastStatus, DeleteBroadCastmessage, UpdateCastmessage } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { SquarePen, Trash2, PanelBottomOpen, Eye } from 'lucide-react';
import { Tooltip } from 'antd';
import { fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';


const Message = () => {
    const navigate = useNavigate();

    useEffect(() => {
        getservice();
        sendmessagedetail();
    }, []);

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');

    const [servicedata, setServicedata] = useState({});
    const [chatMessages, setChatMessages] = useState([]);




    const [isLoading, setIsLoading] = useState(true)


    const getservice = async () => {
        try {
            const response = await GetService(token);
            if (response.status) {
                setServicedata(response?.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
        setIsLoading(false)
    };



    const sendmessagedetail = async () => {
        try {
            const response = await getBroadCastmessage(token);
            if (response.status) {
                setChatMessages(response.data);
            }
        } catch (error) {
            console.log("Error fetching broadcast messages:", error);
        }
        setIsLoading(false)
    };

    const DeleteMessage = async (_id) => {
        try {
            const result = await showCustomAlert("confirm", 'Do you want to delete this broadcast message This action cannot be undone.')

            if (result.isConfirmed) {
                const response = await DeleteBroadCastmessage(_id, token);
                if (response.status) {
                    showCustomAlert("Success", 'The message has been successfully deleted.')
                    sendmessagedetail();
                }
            } else {
                showCustomAlert("error", 'The message deletion was cancelled.')
            }
        } catch (error) {
            showCustomAlert("error", 'There was an error deleting the staff.')
        }
    };

    return (
        <div>
            <div className="page-content">
                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Message Broadcast</div>
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
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex ">
                                    <div className='me-2 mb-3'>
                                        <Link to="/admin/addbroadcast" className="btn btn-primary">
                                            <i className="bx bxs-plus-square" />
                                            Add Broadcast
                                        </Link>
                                    </div>
                                </div>


                                <div className="page-content">
                                    <div className="container py-2">
                                        {chatMessages?.length > 0 ? (
                                            chatMessages.map((item, index) => {
                                                const serviceIds = item.service?.split(',');

                                                const matchedServices = serviceIds?.map(serviceId =>
                                                    (Array.isArray(servicedata) ? servicedata : []).find(service => service?._id === serviceId)
                                                ).filter(Boolean);

                                                return (
                                                    <div className="row" key={index}>
                                                        <div className="col py-2">
                                                            <div className="card" style={{ borderRadius: "10px" }}>
                                                                <div className="card-body">
                                                                    <div className="float-end text-muted">
                                                                        <Tooltip placement="top" overlay="Update">
                                                                            <SquarePen
                                                                                onClick={() => navigate("/admin/updatebroadcast", { state: { item } })}
                                                                            />
                                                                        </Tooltip>
                                                                        <Tooltip placement="top" overlay="Delete">
                                                                            <Trash2 onClick={() => DeleteMessage(item._id)} />
                                                                        </Tooltip>
                                                                    </div>
                                                                    <h4 className="card-title text-muted">
                                                                        <span>
                                                                            {matchedServices.length > 0 ? (
                                                                                matchedServices.some(service => ["C", "O", "F"].includes(service.segment)) ? (
                                                                                    matchedServices.map((service, idx) => (
                                                                                        <span key={idx}>
                                                                                            {service.segment === "C" && <span>CASH </span>}
                                                                                            {service.segment === "O" && <span>OPTION </span>}
                                                                                            {service.segment === "F" && <span>FUTURE </span>}
                                                                                        </span>
                                                                                    ))
                                                                                ) : (
                                                                                    <span>All </span>
                                                                                )
                                                                            ) : (
                                                                                <span>All </span>
                                                                            )}
                                                                        </span>({item.type})
                                                                    </h4>

                                                                    <hr />
                                                                    <p><strong>Subject:</strong> {item.subject}</p>
                                                                    <p className="card-text">
                                                                        <strong>Message:</strong>
                                                                        <span
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: item.message.replace(
                                                                                    /<img /g,
                                                                                    '<img style="width: 300px; height: 150px; object-fit: cover;" '
                                                                                )
                                                                            }}
                                                                            style={{ display: 'block', marginTop: '0.5rem' }}
                                                                        />
                                                                    </p>

                                                                    <p><strong>Created At:</strong> {fDateTime(item.created_at)}</p>
                                                                    <p><strong>Updated At:</strong> {fDateTime(item.updated_at)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center mt-5">
                                                <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                                            </div>
                                        )}



                                    </div>
                                </div>


                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Message;
