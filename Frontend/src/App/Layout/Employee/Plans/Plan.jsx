import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getplanlist, getcategoryplan, Deleteplan, changeplanstatus, getActivecategoryplan } from '../../../Services/Admin';
import { fDateTime, fDate } from '../../../Utils/Date_formate';
import Swal from 'sweetalert2';
import { getstaffperuser } from '../../../Services/Admin';
import Loader from '../../../Utils/Loader'





const Plan = () => {

    const [clients, setClients] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');

    //set state for loding
    const [isLoading, setIsLoading] = useState(true)


    const [permission, setPermission] = useState([]);



    useEffect(() => {
        getAdminclient();
        getcategoryplanlist();
        getpermissioninfo()
    }, []);



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





    const getcategoryplanlist = async () => {
        try {
            const response = await getActivecategoryplan(token);
            if (response.status) {
                setCategory(response.data);

                if (response.data.length > 0) {
                    setSelectedCategoryId('all');
                }
            }
        } catch (error) {
            console.log("error");
        }
        setIsLoading(false)
    };



    const getAdminclient = async () => {
        try {
            const response = await getplanlist(token);
            if (response.status) {
                setClients(response.data);
            }
        } catch (error) {
            console.log("Failed to fetch plans", error);
        }
    };



    const Deleteplanbyadmin = async (_id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this plan? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
            });

            if (result.isConfirmed) {
                const response = await Deleteplan(_id, token);
                if (response.status) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The plan has been successfully deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    getAdminclient();
                }
            } else {
                Swal.fire({
                    title: 'Cancelled',
                    text: 'The plan deletion was cancelled.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the plan.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };



    const handleSwitchChange = async (event, id) => {
        const originalChecked = event.target.checked;
        const user_active_status = originalChecked ? "active" : "inactive";
        const data = { id: id, status: user_active_status };

        const result = await Swal.fire({
            title: "Do you want Changes The Pakage Status?",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
        });

        if (result.isConfirmed) {
            try {
                const response = await changeplanstatus(data, token);
                if (response.status) {
                    Swal.fire({
                        title: "Saved!",
                        icon: "Status changed successfully!",
                        timer: 1000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        Swal.close();
                    }, 1000);
                }
                // Reload the plan list
                getcategoryplanlist();
                getAdminclient();

            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error processing your request.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            event.target.checked = !originalChecked;
            getcategoryplanlist();
        }
    };




    const filteredClients = selectedCategoryId === 'all'
        ? clients
        : clients.filter(client => client.category === selectedCategoryId);



    const stripHtmlTags = (input) => {
        if (!input) return '';
        return input.replace(/<\/?[^>]+(>|$)/g, '');
    }





    return (
        <div className="page-content">
            <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Plan</div>
                <div className="ms-auto">
                    {permission.includes("addplan") ? <div className="btn-group">
                        <Link to="/staff/addplan" className="btn btn-primary">
                            Add Plan
                        </Link>
                    </div> : ""}
                </div>
            </div>
            <hr />

            <div className="card">
                <div className="card-body">
                    <ul className="nav nav-pills mb-1" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a
                                className={`nav-link ${selectedCategoryId === 'all' ? 'active' : 'No data'}`}
                                onClick={() => setSelectedCategoryId('all')}
                                role="tab"
                                aria-selected={selectedCategoryId === 'all'}
                                tabIndex={0}
                            >
                                <div className="d-flex align-items-center">
                                    <div className="tab-title">All</div>
                                </div>
                            </a>
                        </li>

                        {category.map((cat) => (
                            <li className="nav-item" role="presentation" key={cat._id}>
                                <a
                                    className={`nav-link ${cat._id === selectedCategoryId ? 'active' : 'No Data'}`}
                                    onClick={() => setSelectedCategoryId(cat._id)}
                                    role="tab"
                                    aria-selected={cat._id === selectedCategoryId}
                                    tabIndex={0}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="tab-title">{cat.title}</div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <hr />

                    {isLoading ? (
                        <Loader />

                    ) : (
                        <div className="tab-content">
                            <div className="tab-pane fade active show">
                                <div className="pricing-section mt-5">
                                    {filteredClients.length > 0 ? (
                                        <div className="card-container">
                                            <div className="row">
                                                {filteredClients.map((client) => (
                                                    category.find(cat => cat._id === client.category) ?
                                                        <div className="col-md-6 mb-3" key={client._id}>
                                                            <div className="pricing-card">
                                                                <div className="row ">
                                                                    <div className="category-name text-center mb-3 col-md-6 d-flex justify-content-start">
                                                                        <span className="badge bg-primary">
                                                                            {category.find(cat => cat._id === client.category)?.servicesDetails.map((item, index) => (
                                                                                <span key={item._id}>
                                                                                    {item.title}{index < category.find(cat => cat._id === client.category)?.servicesDetails.length - 1 && ', '}
                                                                                </span>
                                                                            ))}
                                                                        </span>
                                                                    </div>
                                                                    <div className="category-name text-center mb-3 col-md-6 d-flex justify-content-end">
                                                                        <span className="badge bg-primary">
                                                                            {category.find(cat => cat._id === client.category)?.title || 'Unknown'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {permission.includes("planstatus") ? <div className="row justify-content-end mb-3">
                                                                    <div className="col-md-6 d-flex justify-content-start">
                                                                        <div className="form-check form-switch form-check-info">
                                                                            <input
                                                                                id={`rating_${client.status}`}
                                                                                className="form-check-input toggleswitch"
                                                                                type="checkbox"
                                                                                defaultChecked={client.status === "active"}
                                                                                onChange={(event) => handleSwitchChange(event, client._id)}
                                                                            />
                                                                            <label
                                                                                htmlFor={`rating_${client.ActiveStatus}`}
                                                                                className="checktoggle checkbox-bg"
                                                                            ></label>
                                                                        </div>
                                                                    </div>
                                                                </div> : ""}

                                                                <div className="row justify-content-between align-items-center">
                                                                    <div className="col-md-6">
                                                                        {/* <h3 className="fonth3">{client.title}</h3> */}
                                                                        <h2 className="fonth2">{client.planType}</h2>
                                                                    </div>
                                                                    <div className="price-section col-md-6">
                                                                        <span className="discount">{client.discount}</span>
                                                                        <h3 className="ms-4 fnt">INR {client.price}</h3>
                                                                    </div>
                                                                </div>
                                                                <hr />
                                                                <ul>
                                                                    <li><b>Validity</b>: {client.validity}</li>
                                                                    <li><b className='mb-1'>Description</b>:<textarea className='form-control' value={stripHtmlTags(client.description || '')} >{client.description}</textarea></li>
                                                                    <li><b>Created At</b>: {fDateTime(client.created_at)}</li>
                                                                </ul>
                                                                <div className="button-group">
                                                                    <button
                                                                        type="button"
                                                                        className="btnsecond"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target={`#modal-${client._id}`}
                                                                    >
                                                                        View More
                                                                    </button>
                                                                    <div
                                                                        className="modal fade"
                                                                        id={`modal-${client._id}`}
                                                                        tabIndex={-1}
                                                                        aria-labelledby={`modalLabel-${client._id}`}
                                                                        aria-hidden="true"
                                                                    >
                                                                        <div className="modal-dialog">
                                                                            <div className="modal-content">
                                                                                <div className="modal-header">
                                                                                    <h5 className="modal-title" id={`modalLabel-${client._id}`}>
                                                                                        {client.title}
                                                                                    </h5>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn-close"
                                                                                        data-bs-dismiss="modal"
                                                                                        aria-label="Close"
                                                                                    />
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <ul>
                                                                                        <li>
                                                                                            <div className="row justify-content-between">
                                                                                                <div className="col-md-6">
                                                                                                    <b>Title</b>
                                                                                                </div>
                                                                                                <div className="col-md-6">
                                                                                                    {client.title}
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                        <li>
                                                                                            <div className="row justify-content-between">
                                                                                                <div className="col-md-6">
                                                                                                    <b>Price</b>
                                                                                                </div>
                                                                                                <div className="col-md-6">
                                                                                                    {client.price}
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                        <li>
                                                                                            <div className="row justify-content-between">
                                                                                                <div className="col-md-6">
                                                                                                    <b>Validity</b>
                                                                                                </div>
                                                                                                <div className="col-md-6">
                                                                                                    {client.validity}
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                        <li>
                                                                                            <div className="row justify-content-between">
                                                                                                <div className="col-md-3">
                                                                                                    <b>Description</b>
                                                                                                </div>
                                                                                                <div className="col-md-9">
                                                                                                    {stripHtmlTags(client.description || '')}
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                        <li>
                                                                                            <div className="row justify-content-between">
                                                                                                <div className="col-md-6">
                                                                                                    <b>Created At</b>
                                                                                                </div>
                                                                                                <div className="col-md-6">
                                                                                                    {fDateTime(client.created_at)}
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                        <li>
                                                                                            <div className="row justify-content-between">
                                                                                                <div className="col-md-6">
                                                                                                    <b>Updated At</b>
                                                                                                </div>
                                                                                                <div className="col-md-6">
                                                                                                    {fDateTime(client.updated_at)}
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {permission.includes("editplan") ? <Link to={`editplan/${client._id}`} className="btnprime" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                                        Edit
                                                                    </Link> : ""}
                                                                </div>
                                                            </div>
                                                        </div> : ""
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h5>No Plans Available</h5>
                                            <div className="text-muted">Please select a category to view details.</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Plan;
