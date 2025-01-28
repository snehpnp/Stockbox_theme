import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getnewslist, AddNewsbyadmin, UpdateNewsbyadmin, changeNewsStatus, DeleteNews } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { SquarePen, Trash2, PanelBottomOpen, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import { image_baseurl } from '../../../../Utils/config';
import { Tooltip } from 'antd';
import { fDate, fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader';




const News = () => {

    const navigate = useNavigate();


    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');

    //state for Loading
    const [isLoading, setIsLoading] = useState(true)


    const [clients, setClients] = useState([]);
    const [model, setModel] = useState(false);
    const [serviceid, setServiceid] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const [updatetitle, setUpdatetitle] = useState({
        title: "",
        id: "",
        description: "",
        image: "",

    });




    const [title, setTitle] = useState({
        title: "",
        description: "",
        image: "",
        add_by: "",
    });






    // Getting services
    const getNews = async () => {
        try {
            const response = await getnewslist(token);
            if (response.status) {
                const filterdata = response.data.filter((item) =>
                    searchInput === "" ||
                    item.title.toLowerCase().includes(searchInput.toLowerCase())
                );
                setClients(searchInput ? filterdata : response.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
        setTimeout(() => {
            setIsLoading(false)
        })
    };





    useEffect(() => {
        getNews();

    }, [searchInput]);





    // Update service
    const updateNews = async () => {
        try {
            const data = { title: updatetitle.title, id: serviceid._id, image: updatetitle.image, description: updatetitle.description };
            const response = await UpdateNewsbyadmin(data, token);

            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: response.message || 'Service updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setUpdatetitle({ title: "", id: "" });
                getNews();
                setModel(false);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error updating the News.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the News.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };





    // Add service
    const AddNews = async () => {
        try {
            const data = { title: title.title, description: title.description, image: title.image, add_by: userid };
            const response = await AddNewsbyadmin(data, token);
            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'blogs added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setTitle({ title: "", add_by: "", description: "" });
                getNews();

                const modal = document.getElementById('exampleModal');
                const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error adding.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error adding',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };




    // Update status
    const handleSwitchChange = async (event, id) => {
        const user_active_status = event.target.checked ? "true" : "false";
        const data = { id: id, status: user_active_status };
        const result = await Swal.fire({
            title: "Do you want to save the changes?",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
        });

        if (result.isConfirmed) {
            try {
                const response = await changeNewsStatus(data, token);
                if (response.status) {
                    Swal.fire({
                        title: "Saved!",
                        icon: "success",
                        timer: 1000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        Swal.close();
                    }, 1000);
                }
                getNews();
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error processing your request.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            getNews();
        }
    };




    // delete news

    const DeleteService = async (_id) => {

        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this News ? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
            });

            if (result.isConfirmed) {
                const response = await DeleteNews(_id, token);
                if (response.status) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The News has been successfully deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    getNews();

                }
            } else {

                Swal.fire({
                    title: 'Cancelled',
                    text: 'The News deletion was cancelled.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the News.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });

        }
    };


    const updateServiceTitle = (updatedField) => {
        setUpdatetitle(prev => ({
            ...prev,
            ...updatedField
        }));
    };




    return (


        <div>
            <div className="page-content">

                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">News</div>
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
                <div className="card">
                    <div className="card-body">
                        <div className="d-lg-flex align-items-center mb-4 gap-3">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5 radius-10"
                                    placeholder="Search News"
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    value={searchInput}
                                />
                                <span className="position-absolute top-50 product-show translate-middle-y">
                                    <i className="bx bx-search" />
                                </span>
                            </div>
                            <div className="ms-auto">
                                <Link
                                    to="/admin/addnews"
                                    type="button"
                                    className="btn btn-primary mt-2 mt-sm-0"
                                // data-bs-toggle="modal"
                                // data-bs-target="#exampleModal"
                                >
                                    <i className="bx bxs-plus-square" />
                                    Add News
                                </Link>

                            </div>
                        </div>
                        <div className="container py-2">
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <>
                                    {clients.length > 0 ? (
                                        clients.map((client, index) => (
                                            <div className="row g-0" key={index}>
                                                <div className="col-sm ">
                                                    <div className={`card ${client.borderClass || 'radius-15'} d-flex justify-content-center align-items-center`}>
                                                        <div className="card-body" style={{ width: "100%" }}>
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <h5 className="card-title text-muted mb-0">{client.title}</h5 >
                                                                <div>
                                                                    <Tooltip placement="top" overlay="Update">
                                                                        <SquarePen
                                                                            onClick={() => navigate("/admin/updatenews", { state: { client } })}
                                                                        />
                                                                    </Tooltip>
                                                                    <Tooltip placement="top" overlay="Delete">
                                                                        <Trash2 onClick={() => DeleteService(client._id)} />
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="row">
                                                                {/* Image on the left side */}
                                                                <div className="col-md-2" style={{ borderRight: "1px solid #D0D0D0", textAlign: "center" }}>
                                                                    <img
                                                                        src={`${image_baseurl}uploads/news/${client.image}`}
                                                                        alt={client.image}
                                                                        className="img-fluid"
                                                                        width="65%"
                                                                        height="auto"
                                                                    />
                                                                </div>
                                                                <div className="col-md-10 ps-4">
                                                                    <h5>Description:</h5>
                                                                    <div
                                                                        className="form-control"
                                                                        style={{ width: "100%" }}
                                                                        dangerouslySetInnerHTML={{ __html: client.description || "" }}
                                                                        readOnly
                                                                    />
                                                                    <div className="float-end text-muted small">{fDateTime(client.created_at)}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-5">
                                            <p>No records found</p>
                                        </div>
                                    )}
                                </>
                            )}


                        </div>
                    </div>
                </div>




            </div>
        </div>
    );
};

export default News;
