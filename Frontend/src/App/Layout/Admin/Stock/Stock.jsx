import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getstocklist, AddstockbyAdmin, Updatestock, Stockstatus, DeleteStock, Setstockinbulk } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { SquarePen, Trash2, PanelBottomOpen } from 'lucide-react';
import Swal from 'sweetalert2';
import { useRef } from 'react';


const Stock = () => {



    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [model, setModel] = useState(false);
    const [serviceid, setServiceid] = useState({});
    const [searchInput, setSearchInput] = useState("");


    const [updatetitle, setUpdatetitle] = useState({
        title: "",
        id: "",
        symbol: "",
    });


    const [title, setTitle] = useState({
        title: "",
        add_by: "",
        symbol: "",
    });

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');





    // Getting services
    const getstock = async () => {
        try {
            const response = await getstocklist(token);
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



    useEffect(() => {
        getstock();
    }, [searchInput]);


    // get 


    // Update service
    const UpdateStockbyadmin = async () => {
        try {
            const data = { title: updatetitle.title, id: serviceid._id, symbol: updatetitle.symbol };
            const response = await Updatestock(data, token);

            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Service updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setUpdatetitle({ title: "", id: "", symbol: "" });
                getstock();
                setModel(false);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error updating the service.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the service.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };





    // Add service
    const addStock = async () => {
        try {
            const data = { title: title.title, add_by: userid, symbol: title.symbol };
            const response = await AddstockbyAdmin(data, token);
            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Service added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setTitle({ title: "", add_by: "", symbol: "" });
                getstock();

                const modal = document.getElementById('exampleModal');
                const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error adding the service.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error adding the service.',
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
                const response = await Stockstatus(data, token);
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
                getstock();
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error processing your request.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            getstock();
        }
    };




    // delete sevices


    // delete plan cartegory 

    const DeleteStockbyadmin = async (_id) => {

        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this ? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel',
            });

            if (result.isConfirmed) {
                const response = await DeleteStock(_id, token);
                if (response.status) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The staff has been successfully deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    getstock();

                }
            } else {

                Swal.fire({
                    title: 'Cancelled',
                    text: 'The staff deletion was cancelled.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the staff.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });

        }
    };





    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '70px',
        },
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'symbol',
            selector: row => row.symbol,
            sortable: true,
        },
        {
            name: 'Active Status',
            selector: row => (
                <div className="form-check form-switch form-check-info">
                    <input
                        id={`rating_${row.status}`}
                        className="form-check-input toggleswitch"
                        type="checkbox"
                        checked={row.status === true}
                        onChange={(event) => handleSwitchChange(event, row._id)}
                    />
                    <label
                        htmlFor={`rating_${row.status}`}
                        className="checktoggle checkbox-bg"
                    ></label>
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Created At',
            selector: row => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'Updated At',
            selector: row => new Date(row.updated_at).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <div>
                        <SquarePen
                            onClick={() => {
                                setModel(true);
                                setServiceid(row);
                                setUpdatetitle({ title: row.title, symbol: row.symbol, id: row._id });
                            }}
                        />
                    </div>
                    <div>
                        <Trash2 onClick={() => DeleteStockbyadmin(row._id)} />
                    </div>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];



    // const updateServiceTitle = (value) => {
    //     setUpdatetitle(prev => ({
    //         ...prev,
    //         title: value
    //     }));
    // };


    const updateServiceTitle = (field, value) => {
        setUpdatetitle(prev => ({
            ...prev,
            [field]: value
        }));
    };




    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };


    const handleAddPdf = async () => {
        if (selectedFile) {
            try {
                const data = { add_by: userid, file: selectedFile };
                const response = await Setstockinbulk(data, token);

                if (response.status) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'File uploaded successfully.',
                        confirmButtonText: 'OK',
                        timer: 2000,
                    });

                    setSelectedFile("");
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }

                    getstock();
                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to upload file. Please try again.',
                        confirmButtonText: 'OK',
                        timer: 2000,
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Unexpected Error!',
                    text: 'An error occurred during file upload.',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'No File Selected!',
                text: 'Please choose a file to upload.',
                confirmButtonText: 'OK',
                timer: 2000,
            });
        }
    };
    return (
        <div>
            <div className="page-content">

                <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Stock</div>
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

                <div className="card">
                    <div className="card-body">
                        <div className="d-lg-flex align-items-center mb-4 gap-3">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5 radius-10"
                                    placeholder="Search Order"
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    value={searchInput}
                                />
                                <span className="position-absolute top-50 product-show translate-middle-y">
                                    <i className="bx bx-search" />
                                </span>
                            </div>


                            <div className="ms-auto">

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                >
                                    <i className="bx bxs-plus-square" />
                                    Add Stock
                                </button>

                                <div
                                    className="modal fade"
                                    id="exampleModal"
                                    tabIndex={-1}
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">
                                                    Add Stock
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                />
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <label htmlFor="">Stock</label>
                                                            <input
                                                                className="form-control mb-3"
                                                                type="text"
                                                                placeholder='Enter Service Title'
                                                                value={title.title}
                                                                onChange={(e) => setTitle({ ...title, title: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <label htmlFor="">symbol</label>
                                                            <input
                                                                className="form-control mb-3"
                                                                type="text"
                                                                placeholder='Enter symbol'
                                                                value={title.symbol}
                                                                onChange={(e) => setTitle({ ...title, symbol: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    data-bs-dismiss="modal"
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={addStock}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {model && (
                                    <div
                                        className="modal fade show"
                                        style={{ display: 'block' }}
                                        tabIndex={-1}
                                        aria-labelledby="exampleModalLabel"
                                        aria-hidden="true"
                                    >
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">
                                                        Update Service
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={() => setModel(false)}
                                                    />
                                                </div>
                                                <div className="modal-body">
                                                    <form>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <label htmlFor="serviceTitle">Stock</label>
                                                                <input
                                                                    className="form-control mb-2"
                                                                    type="text"
                                                                    id="serviceTitle"
                                                                    placeholder='Enter Service Title'
                                                                    value={updatetitle.title}
                                                                    onChange={(e) => updateServiceTitle('title', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <label htmlFor="serviceSymbol">Symbol</label>
                                                                <input
                                                                    className="form-control mb-2"
                                                                    type="text"
                                                                    id="serviceSymbol"
                                                                    placeholder='Enter Symbol'
                                                                    value={updatetitle.symbol}
                                                                    onChange={(e) => updateServiceTitle('symbol', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
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
                                                        onClick={UpdateStockbyadmin}
                                                    >
                                                        Update Stock
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='d-flex'>
                                <input
                                    className='form-control'
                                    type="file"
                                    id="csvFile"
                                    name="csvFile"
                                    // accept=".csv"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ width: "240px", border: "2px solid black", marginRight: "8px" }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddPdf}
                                >
                                    <i className="bx bxs-plus-square" />
                                    Upload CSV
                                </button>
                            </div>



                        </div>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stock;
