import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { getbannerlist, AddQRdetaildata, UpdateBanner, changeBannerStatus, DeleteBanner } from '../../../Services/Admin';
import Table from '../../../../Extracomponents/Table';
import { SquarePen, Trash2, PanelBottomOpen, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import { fDateTime } from '../../../../../Utils/Date_formate';
import { image_baseurl } from '../../../../../Utils/config';
import { Tooltip } from 'antd';
import { AddQRdetaildata, getQrdetails, UpdateQrcodelist, DeleteQRCode, changeQRstatuscode } from '../../../../Services/Admin/Admin';
import ReusableModal from '../../../../components/Models/ReusableModal';

const QRDetails = () => {


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [model, setModel] = useState(false);
    const [serviceid, setServiceid] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const [showModal, setShowModal] = useState(false);



    const [updatetitle, setUpdatetitle] = useState({
        title: "",
        id: "",
        description: "",
        image: "",
        hyperlink: ""

    });


    const [title, setTitle] = useState({
        title: "",
        description: "",
        image: "",
        add_by: "",
        hyperlink: ""
    });

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');





    // Getting services
    const getQrlist = async () => {
        try {
            const response = await getQrdetails(token);
            if (response.status) {
                setClients(response.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };

    useEffect(() => {
        getQrlist();
    }, []);




    // // Update service
    const updateQr = async () => {
        try {
            const data = { id: serviceid._id, image: updatetitle.image };

            const response = await UpdateQrcodelist(data, token);

            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: response.message || 'Banner updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setUpdatetitle({ title: "", id: "", hyperlink: "" });
                getQrlist();
                setModel(false);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error updating the Banner.',
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
    const AddQR = async () => {
        try {
            const data = { image: title.image };


            const response = await AddQRdetaildata(data, token);
            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: response.message || 'QR added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setTitle({ title: "", add_by: "", hyperlink: "" });
                getQrlist();
                setShowModal(false)

                const modal = document.getElementById('exampleModal');
                const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.message || 'There was an error adding.',
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




    // // Update status


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
                const response = await changeQRstatuscode(data, token);
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
                getQrlist();
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error processing your request.",
                    "error"
                );
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            getQrlist();
        }
    };




    // delete news

    const DeletQrlist = async (_id) => {
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
                const response = await DeleteQRCode(_id, token);
                if (response.status) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The QR Code has been successfully deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    getQrlist();

                }
            } else {

                Swal.fire({
                    title: 'Cancelled',
                    text: 'The QR deletion was cancelled.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the QR.',
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


        },

        {
            name: 'Image',
            cell: row => <img src={`${image_baseurl}uploads/bank/${row.image}`} alt={row.image} title={row.image} width="50" height="50" />,
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


        },
        {
            name: 'Created At',
            selector: row => fDateTime(row.created_at),
            sortable: true,


        },
        // {
        //     name: 'Updated At',
        //     selector: row => fDateTime(row.updated_at),
        //     sortable: true,
        // },


        {
            name: 'Actions',
            cell: row => (
                <>

                    <div>
                        <Tooltip placement="top" overlay="Update">
                            <SquarePen
                                onClick={() => {
                                    setModel(true);
                                    setServiceid(row);
                                    setUpdatetitle({ id: row._id, image: row.image, });
                                }}
                            />
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip placement="top" overlay="Delete">
                            <Trash2 onClick={() => DeletQrlist(row._id)} />
                        </Tooltip>
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
                    <div className="breadcrumb-title pe-3">QR Details</div>
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
                            </div>
                            <div className="ms-auto">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => { setShowModal(true) }}

                                >
                                    <i className="bx bxs-plus-square" />
                                    Add QR Code
                                </button>

                                <ReusableModal
                                    show={showModal}
                                    onClose={() => setShowModal(false)}
                                    title={<>Add QR</>}
                                    body={
                                        <>
                                            <div className="modal-body">
                                                <form>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <label htmlFor="imageUpload">Upload Image</label>
                                                            <input
                                                                className="form-control mb-3"
                                                                type="file"
                                                                accept="image/*"
                                                                id="imageUpload"
                                                                onChange={(e) => setTitle({ ...title, image: e.target.files[0] })}
                                                            />
                                                        </div>

                                                    </div>
                                                </form>
                                            </div>

                                        </>
                                    }
                                    footer={
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={AddQR}
                                            >
                                                Add QR
                                            </button>
                                            <button
                                                className="btn btn-primary rounded-1"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    }
                                />



                                <ReusableModal
                                    show={model}
                                    onClose={() => setModel(false)}
                                    title={<>Update QR Code</>}
                                    body={
                                        <>


                                            <div className="modal-body">
                                                <form>
                                                    <div className="row">
                                                        <div className="col-md-10">
                                                            <label htmlFor="imageUpload">Image</label>
                                                            <input
                                                                className="form-control mb-3"
                                                                type="file"
                                                                accept="image/*"
                                                                id="imageUpload"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        updateServiceTitle({ image: file });
                                                                    }

                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-2">

                                                            {updatetitle.image && (
                                                                <div className="file-preview">
                                                                    <img
                                                                        src={
                                                                            typeof updatetitle.image === 'string'
                                                                                ? `${image_baseurl}uploads/bank/${updatetitle.image}`
                                                                                : URL.createObjectURL(updatetitle.image)
                                                                        }
                                                                        alt="Image Preview"
                                                                        className="image-preview mt-4"
                                                                        style={{ width: "68px", height: "auto" }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                </form>


                                            </div>

                                        </>
                                    }
                                    footer={
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={updateQr}
                                            >
                                                Update QR Code
                                            </button>
                                            <button
                                                className="btn btn-primary rounded-1"
                                                onClick={() => setModel(false)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    }
                                />


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

export default QRDetails;
