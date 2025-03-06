import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getnewslist, AddNewsbyadmin, UpdateNewsbyadmin, changeNewsStatus, getstaffperuser, DeleteNews } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { SquarePen, Trash2, PanelBottomOpen, Eye } from 'lucide-react';
import { image_baseurl } from '../../../../Utils/config';
import { Tooltip } from 'antd';
import { fDate, fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';




const News = () => {

    const navigate = useNavigate();


    const [permission, setPermission] = useState([]);
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

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');





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
    };


    const getpermissioninfo = async () => {
        try {
            const response = await getstaffperuser(userid, token);
            if (response.status) {
                setPermission(response.data.permissions);
            }
        } catch (error) {
            console.log("error", error);
        }
    }



    useEffect(() => {
        getNews();

    }, [searchInput]);


    useEffect(() => {
        getpermissioninfo()
    }, []);



    // Update service
    const updateNews = async () => {
        try {
            const data = { title: updatetitle.title, id: serviceid._id, image: updatetitle.image, description: updatetitle.description };
            const response = await UpdateNewsbyadmin(data, token);

            if (response && response.status) {
                showCustomAlert('Success',response.message || 'Service updated successfully.')
                setUpdatetitle({ title: "", id: "" });
                getNews();
                setModel(false);
            } else {
                showCustomAlert('error',response.message || 'There was an error updating the News.')
            }
        } catch (error) {
            showCustomAlert('error',"There was an error updating the News.")
        }
    };





    // Add service
    const AddNews = async () => {
        try {
            const data = { title: title.title, description: title.description, image: title.image, add_by: userid };
            const response = await AddNewsbyadmin(data, token);
            if (response && response.status) {
                showCustomAlert('Success',response.message || 'blogs added successfully.')
                setTitle({ title: "", add_by: "", description: "" });
                getNews();

                const modal = document.getElementById('exampleModal');
                const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            } else {
                showCustomAlert('error','There was an error adding the News.')
            }
        } catch (error) {
            showCustomAlert('error',"There was an error adding the News.")
        }
    };




    // Update status
    const handleSwitchChange = async (event, id) => {
        const user_active_status = event.target.checked ? "true" : "false";
        const data = { id: id, status: user_active_status };
        const result = await showCustomAlert("confirm","Do you want to save the changes?")
        if (result) {
            try {
                const response = await changeNewsStatus(data, token);
                if (response.status) {
                    showCustomAlert('Success','Status Changed.')
                }
                getNews();
            } catch (error) {
                showCustomAlert('error',"There was an error processing your request.")
            }
        } else {
            event.target.checked = !user_active_status;
            getNews();
        }
    };




    // delete news

    const DeleteService = async (_id) => {

        try {
            const result = await showCustomAlert("confirm", 'Do you want to delete this News This action cannot be undone.')

            if (result) {
                const response = await DeleteNews(_id, token);
                if (response.status) {
                    showCustomAlert("Success", 'The News has been successfully deleted.')
                    getNews();

                }
            } else {
                showCustomAlert("error", 'The News deletion was cancelled.')

            }
        } catch (error) {
            showCustomAlert("error", 'There was an error deleting the News.')

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
                                    <Link to="/employee/dashboard">
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
                        <div className="d-sm-flex align-items-center mb-4 gap-3">
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
                            {permission.includes("addnews") ? <div className="ms-auto mt-2 mt-sm-0">
                                <Link
                                    to="/employee/addnews"
                                    type="button"
                                    className="btn btn-primary"
                                // data-bs-toggle="modal"
                                // data-bs-target="#exampleModal"
                                >
                                    <i className="bx bxs-plus-square" />
                                    Add News
                                </Link>

                            </div> : ""}
                        </div>
                        <div className="container py-2">



                            {clients.map((client, index) => (
                                <div className="row g-0" key={index}>
                                    { }


                                    <div className="col-sm py-2">

                                        <div className={`card ${client.borderClass || 'radius-15'} d-flex justify-content-center align-items-center`} >

                                            <div className="card-body" style={{ width: "100%" }}>
                                                <div className="d-flex justify-content-between align-items-start">

                                                    <h5 className="card-title text-muted mb-0">{client.title}</h5>

                                                    <div>

                                                        {permission.includes("editnews") ? <Tooltip placement="top" overlay="Update">
                                                            <SquarePen
                                                            className='me-2'
                                                                onClick={() => {
                                                                    navigate("/employee/updatenews", { state: { client } })
                                                                }}
                                                            />
                                                        </Tooltip> : ""}
                                                        {permission.includes("deletenews") ? <Tooltip placement="top" overlay="Delete">
                                                            <Trash2 onClick={() => DeleteService(client._id)} />
                                                        </Tooltip> : ""}
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    {/* Image on the left side */}
                                                    <div className="col-md-2 border-md-right border-end" style={{  textAlign: "center" }}>
                                                        <img
                                                            src={`${image_baseurl}uploads/news/${client.image}`}

                                                            alt={client.image}
                                                            className="img-fluid"
                                                            width="65%"
                                                            height="auto"
                                                        />
                                                    </div>

                                                    {/* <div className="row mb-3 align-items-center">
                                                        <label htmlFor="description" className="col-sm-3 col-form-label">
                                                            <b>Description</b>
                                                        </label>
                                                        <div className="col-sm-9">
                                                            <div className="input-group">
                                                                <div
                                                                    className="form-control"
                                                                    style={{ width: "100%" }}
                                                                    dangerouslySetInnerHTML={{ __html: row.description || "" }}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    </div> */}


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
                            ))}


                        </div>
                    </div>
                </div>




            </div>
        </div>
    );
};

export default News;
