import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getplanlist, getcategoryplan, Deleteplan, changeplanstatus, getActivecategoryplan, getstaffperuser } from '../../../Services/Admin/Admin';
import { fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader'
import Content from '../../../components/Contents/Content';
import ReusableModal from '../../../components/Models/ReusableModal';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';




const Plan = () => {


    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');


    const [clients, setClients] = useState([]);
    const [category, setCategory] = useState([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const [isLoading, setIsLoading] = useState(true)
    const [showViewModal, setShowViewModal] = useState(false);

    const [visibleCount, setVisibleCount] = useState(10);
    const [expanded, setExpanded] = useState(false);
    const [permission, setPermission] = useState([]);




    useEffect(() => {
        getAdminclient();
        getcategoryplanlist();
        getpermissioninfo();
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
            const result = await showCustomAlert("confirm", "Do you want to delete this plan? This action cannot be undone.");

            if (result.isConfirmed) {
                const response = await Deleteplan(_id, token);
                if (response.status) {
                    showCustomAlert('Success', 'The plan has been successfully deleted.')
                    getAdminclient();
                }
            } else {
                showCustomAlert('info', 'The plan deletion was cancelled.')
            }
        } catch (error) {
            showCustomAlert('error', 'There was an error deleting the plan.')
        }
    };



    const handleSwitchChange = async (event, id) => {
        const originalChecked = event.target.checked;
        const user_active_status = originalChecked ? "active" : "inactive";
        const data = { id: id, status: user_active_status };

        const result = await showCustomAlert('confirm', 'Do you want Changes The Pakage Status?')
        // console.log("result.isConfirmed",result.isConfirmed);
        // return


        if (result.isConfirmed) {
            try {
                const response = await changeplanstatus(data, token);
                if (response.status) {
                    showCustomAlert('Success', 'The plan status has been successfully updated.')
                }
                getcategoryplanlist();
                getAdminclient();

            } catch (error) {
                showCustomAlert('error', 'There was an error updating the plan status.')
            }
        } else {
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




    // Show all categories with animation
    const loadAll = () => {
        setExpanded(true);
        setVisibleCount(category.length);
    };

    // Show only first 10 categories with animation
    const showLess = () => {
        setExpanded(false);
        setTimeout(() => setVisibleCount(10), 300); // Animation ke baad count update karega
    };

    return (
        <Content Page_title="Package"
            route="/admin/addplan"
            button_status={permission.includes("addplan") && true}
            button_title="Add Package"
        >


            <ul className="nav nav-pills mb-1 d-flex align-items-center" role="tablist">
                {/* "All" Tab */}
                <li className="nav-item" role="presentation">
                    <a
                        className={`nav-link ${selectedCategoryId === 'all' ? 'active' : ''}`}
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

                {/* Category Tabs */}
                {category.slice(0, visibleCount).map((cat) => (
                    <li className="nav-item" role="presentation" key={cat._id}>
                        <a
                            className={`nav-link ${cat._id === selectedCategoryId ? 'active' : ''}`}
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

                {/* Load More/Less Button */}
                {category.length > 10 && (
                    <li className="nav-item d-flex align-items-center gap-1">
                        {visibleCount < category.length && (
                            <button className="nav-link p-0" onClick={loadAll}>🔽</button>  // Show all categories
                        )}
                        {visibleCount > 10 && (
                            <button className="nav-link p-0" onClick={showLess}>🔼</button>  // Show only 10 categories
                        )}
                    </li>
                )}
            </ul>

            <hr />

            {isLoading ? (
                <Loader />

            ) : filteredClients.length > 0 ? (

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
                                                                    {category.find(cat => cat._id === client.category)?.title || ''}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {permission.includes("planstatus") && <div className="row justify-content-end mb-3">
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
                                                        </div>}

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
                                                        <ul className='p-0'>
                                                            <li><b>Validity</b>: {client.validity}</li>
                                                            <li><b className='mb-1'>Description</b> : <textarea className='form-control' value={stripHtmlTags(client.description || '')} >{client.description}</textarea></li>
                                                            <li><b>Created At</b>: {fDateTime(client.created_at)}</li>
                                                        </ul>

                                                        <div className="button-group gap-2 d-sm-flex">
                                                            {permission.includes("viewplan") && <button
                                                                type="button"
                                                                className="btnsecond btn btn-primary w-100 w-sm-50"
                                                                onClick={() => setShowViewModal(client._id)}
                                                            >
                                                                View More
                                                            </button>}

                                                            {showViewModal === client._id && (
                                                                <ReusableModal
                                                                    show={true}
                                                                    onClose={() => setShowViewModal(null)}
                                                                    title={<>Plan Detail</>}
                                                                    body={
                                                                        <ul>
                                                                            <li>
                                                                                <div className="row justify-content-between">
                                                                                    <div className="col-md-3">
                                                                                        <b>Price</b>
                                                                                    </div>
                                                                                    <div className="col-md-9">{client.price}</div>
                                                                                </div>
                                                                            </li>
                                                                            <li>
                                                                                <div className="row justify-content-between">
                                                                                    <div className="col-md-3">
                                                                                        <b>Validity</b>
                                                                                    </div>
                                                                                    <div className="col-md-9">{client.validity}</div>
                                                                                </div>
                                                                            </li>
                                                                            <li>
                                                                                <div className="row justify-content-between">
                                                                                    <div className="col-md-3">
                                                                                        <b>Created At</b>
                                                                                    </div>
                                                                                    <div className="col-md-9">{fDateTime(client.created_at)}</div>
                                                                                </div>
                                                                            </li>
                                                                            <li>
                                                                                <div className="row justify-content-between">
                                                                                    <div className="col-md-3">
                                                                                        <b>Updated At</b>
                                                                                    </div>
                                                                                    <div className="col-md-9">{fDateTime(client.updated_at)}</div>
                                                                                </div>
                                                                            </li>
                                                                            <li>
                                                                                <div className="row justify-content-between">
                                                                                    <div className="col-md-3">
                                                                                        <b>Description</b>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <textarea className='form-control ' value={stripHtmlTags(client?.description || '')} >{client?.description}</textarea>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    }
                                                                />
                                                            )}

                                                            {permission.includes("editplan") && <Link
                                                                to={`editplan/${client._id}`}
                                                                className="btnsecond btn btn-secondary w-100 w-sm-50 mt-3 mt-sm-0"
                                                                style={{ color: 'inherit', textDecoration: 'none' }}
                                                            >
                                                                Edit
                                                            </Link>}
                                                        </div>





                                                    </div>
                                                </div>
                                                : ""
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
            ) : (
                <div className="text-center mt-5">
                    <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                </div>
            )}

        </Content>

    );
};

export default Plan;
