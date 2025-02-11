import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GetService, Addplancategory, UpdateCategoryplan, getcategoryplan, getstaffperuser, deleteplancategory, updatecategorydstatus } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { SquarePen, Trash2, PanelBottomOpen } from 'lucide-react';
import Swal from 'sweetalert2';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import { Tooltip } from 'antd';
import styled from 'styled-components';
import { fDateTime } from '../../../../Utils/Date_formate';
import Loader from '../../../../Utils/Loader'
import ReusableModal from '../../../components/Models/ReusableModal';
import Select from 'react-select'







const Category = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [model, setModel] = useState(false);
    const [serviceid, setServiceid] = useState({});
    const [servicedata, setServicedata] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [permission, setPermission] = useState([]);

    //set state for loding
    const [isLoading, setIsLoading] = useState(true)

    const [showAddModal, setShowAddModal] = useState(false);


    const [updatetitle, setUpdatetitle] = useState({
        title: "",
        id: "",
        service: ""
    });




    const [title, setTitle] = useState({
        title: "",
        add_by: "",
        service: ""
    });

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');




    // Getting services
    const getcategory = async () => {
        try {
            const response = await getcategoryplan(token);
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
        setIsLoading(false)
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


    const getservice = async () => {
        try {
            const response = await GetService(token);
            if (response.status) {
                setServicedata(response.data)

            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };



    useEffect(() => {
        getcategory();
        getservice()
        getpermissioninfo()
    }, [searchInput]);




    // Update service
    const Updatecategory = async () => {

        try {

            const data = { title: updatetitle.title, id: serviceid._id, service: updatetitle.service };

            const response = await UpdateCategoryplan(data, token);
            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: response.message || 'Category updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setUpdatetitle({ title: "", id: "", service: "" });
                getcategory();
                setModel(false);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error updating the Category.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'server error',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };



    // Add service
    const addcategory = async () => {
        try {

            const data = { title: title.title, add_by: userid, service: title.service };
            const response = await Addplancategory(data, token);
            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: response.message || 'Category added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setTitle({ title: "", add_by: "", service: "" });
                getcategory();

                const modal = document.getElementById('exampleModal');
                const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error adding the Category.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'server error.',
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
                const response = await updatecategorydstatus(data, token);
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
                getcategory();
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error processing your request.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            getcategory();
        }
    };




    // delete plan cartegory 

    const DeleteCategory = async (_id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this catrgory? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
            });

            if (result.isConfirmed) {
                const response = await deleteplancategory(_id, token);
                if (response.status) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The catrgory has been successfully deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    getcategory();

                }
            } else {

                Swal.fire({
                    title: 'Cancelled',
                    text: 'The catrgory deletion was cancelled.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the catrgory.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });

        }
    };






    const handleCheckboxChange = (serviceId) => {
        setSelectedServices((prevSelected) => {
            if (prevSelected.includes(serviceId)) {
                return prevSelected.filter((id) => id !== serviceId);
            } else {
                return [...prevSelected, serviceId];
            }
        });
    };



    const columns = [
        // {
        //     name: 'S.No',
        //     selector: (row, index) => 10 + index + 1,
        //     sortable: false,
        //     width: '78px',
        // },
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Segment',
            selector: row => row.servicesDetails.map(item => item.title).join(', '),
            width: '200px',
            sortable: true,
        },
        permission.includes("categorystatus") ? {
            name: 'Active Status',
            selector: row => (
                <div className="form-check form-switch form-check-info">
                    <input
                        id={`rating_${row.status}`}
                        className="form-check-input toggleswitch"
                        type="checkbox"
                        checked={row.status == true}
                        onChange={(event) => handleSwitchChange(event, row._id)}
                    />
                    <label
                        htmlFor={`rating_${row.status}`}
                        className="checktoggle checkbox-bg"
                    ></label>
                </div>
            ),
            sortable: true,
            width: '200px',
        } : "",
        {
            name: 'Created At',
            selector: row => fDateTime(row.created_at),
            sortable: true,
            width: '200px',
        },
        {
            name: 'Updated At',
            selector: row => fDateTime(row.updated_at),
            sortable: true,
            width: '200px',
        },

        {
            name: 'Actions',
            cell: row => (
                <>
                    <div>
                        {permission.includes("editcategory") ? <Tooltip placement="top" overlay="Update">
                            <SquarePen
                                onClick={() => {
                                    setModel(true);
                                    setServiceid(row);
                                    setUpdatetitle({
                                        title: row.title, id: row._id, service: row.servicesDetails.map((item) => {
                                            return item.title, item._id
                                        })
                                    });
                                }}
                            />
                        </Tooltip> : ""}
                    </div>
                    <div>
                        {/* <Tooltip placement="top" overlay="Delete">
                            <Trash2 onClick={() => DeleteCategory(row._id)} />
                        </Tooltip> */}
                    </div>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];



    const updateServiceTitle = (key, value) => {
        setUpdatetitle(prev => ({
            ...prev,
            [key]: value
        }));
    };




    const handleServiceChange = (serviceId, isChecked) => {
        if (isChecked) {
            setUpdatetitle({
                ...updatetitle,
                service: [...updatetitle.service, serviceId],
            });
        } else {
            setUpdatetitle({
                ...updatetitle,
                service: updatetitle.service.filter((id) => id !== serviceId),
            });
        }
    };





    return (
        <div>
            <div className="page-content">

                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Category</div>
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
                                    placeholder="Search Category"
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    value={searchInput}
                                />
                                <span className="position-absolute top-50 product-show translate-middle-y">
                                    <i className="bx bx-search" />
                                </span>
                            </div>
                            {permission.includes("addcategory") ?
                                <div className="ms-sm-auto  ms-0 mt-2 mt-sm-0">
                                    <button
                                        type="button"
                                        className="btn btn-primary "
                                        onClick={() => setShowAddModal(true)}
                                    >
                                        <i className="bx bxs-plus-square" />
                                        Add Category
                                    </button>

                                    <ReusableModal
                                        show={showAddModal}
                                        onClose={() => { setShowAddModal(false); setTitle("") }}
                                        title={<span>Add Category</span>}
                                        body={
                                            <>
                                                <div className="row">
                                                    <div className="col-md-12 mb-3">
                                                        <label htmlFor="service">Segment</label>
                                                        <span className="text-danger">*</span>

                                                        <div style={{ border: "2px solid #ccc", borderRadius: "10px" }}>

                                                            {servicedata.length > 0 && (
                                                                <Select
                                                                    options={servicedata.map(({ _id, title }) => ({
                                                                        value: _id,
                                                                        label: title,
                                                                    }))}
                                                                    isMulti
                                                                    placeholder="Select Segment"
                                                                    onChange={(selected) =>
                                                                        setTitle((prev) => ({
                                                                            ...prev,
                                                                            service: selected.map((item) => item.value),
                                                                        }))
                                                                    }
                                                                />
                                                            )}
                                                        </div>

                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="categoryTitle">Category</label>
                                                        <span className="text-danger">*</span>
                                                        <input
                                                            id="categoryTitle"
                                                            className="form-control mb-3"
                                                            type="text"
                                                            placeholder="Enter Category Title"
                                                            value={title.title}
                                                            onChange={(e) => setTitle({ ...title, title: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        footer={
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => { setShowAddModal(false); setTitle("") }}
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={addcategory}
                                                >
                                                    Save
                                                </button>
                                            </>
                                        }
                                    />


                                    {model && (
                                        <ReusableModal
                                            show={model}
                                            onClose={() => setModel(false)}
                                            title={<span>Update Category</span>}
                                            body={
                                                <form>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <label htmlFor="category">Category</label>
                                                            <span className="text-danger">*</span>
                                                            <input
                                                                className="form-control mb-2"
                                                                type="text"
                                                                placeholder="Enter Category Title"
                                                                id="category"
                                                                value={updatetitle.title}
                                                                onChange={(e) => updateServiceTitle('title', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <label htmlFor="service">Segment</label>
                                                            <span className="text-danger">*</span>
                                                            {servicedata.length > 0 && (
                                                                <div className="form-group">
                                                                    {servicedata.map((item) => (
                                                                        <div key={item._id} className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id={`service_${item._id}`}
                                                                                value={item._id}
                                                                                checked={updatetitle.service.includes(item._id)}
                                                                                onChange={(e) => handleServiceChange(item._id, e.target.checked)}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={`service_${item._id}`}>
                                                                                {item.title}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </form>
                                            }
                                            footer={
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => setModel(false)}
                                                    >
                                                        Close
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={Updatecategory}
                                                        disabled={!updatetitle.title || !updatetitle.service}
                                                    >
                                                        Update Service
                                                    </button>
                                                </>
                                            }
                                        />
                                    )}
                                </div>
                                : ""}
                        </div>
                        {isLoading ? (
                            <Loader />

                        ) : (
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    data={clients}
                                    pagination
                                    striped
                                    highlightOnHover
                                    dense
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Category;
