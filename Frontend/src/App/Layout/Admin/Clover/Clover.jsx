import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getCloverlist,
    AddClover,
    UpdateClover,
    changeCloverStatus,
    DeleteClover,
} from "../../../Services/Admin/Admin";
import Table from "../../../Extracomponents/Table";
import { SquarePen, Trash2, PanelBottomOpen, Eye } from "lucide-react";
import { fDateTime } from "../../../../Utils/Date_formate";
import { image_baseurl } from "../../../../Utils/config";
import { Tooltip } from "antd";
import Loader from "../../../../Utils/Loader";
import ReusableModal from "../../../components/Models/ReusableModal";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";



const Clover = () => {


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [model, setModel] = useState(false);
    const [serviceid, setServiceid] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const fileInputRef = useRef(null);
    const [showModal, setShowModal] = useState(false);



    //state for loading
    const [isLoading, setIsLoading] = useState(true);

    const [updatetitle, setUpdatetitle] = useState({
        title: "",
        id: "",
        image: "",
    });

    const [title, setTitle] = useState({
        title: "",
        image: "",
        add_by: "",
    });



    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("id");



    // Getting services
    const getClover = async () => {
        try {
            const response = await getCloverlist(token);
            if (response.status) {
                const filterdata = response.data.filter(
                    (item) =>
                        searchInput === "" ||
                        item.title.toLowerCase().includes(searchInput.toLowerCase())
                );
                setClients(searchInput ? filterdata : response.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
        setTimeout(() => {
            setIsLoading(false);
        });
    };



    useEffect(() => {
        getClover();
    }, [searchInput]);



    const updateClover = async () => {
        try {
            const data = {
                id: serviceid._id,
                image: updatetitle.image,
                title: updatetitle.title,

            };

            const response = await UpdateClover(data, token);

            if (response && response.status) {
                showCustomAlert("Success", response.message)
                setUpdatetitle({ title: "", id: "", image: "" });
                getClover();
                setModel(false);
            } else {
                showCustomAlert("error", response.message)
            }
        } catch (error) {
            showCustomAlert("error", "server error")
        }
    };



    const Addclover = async () => {
        try {
            const data = {
                title: title.title,
                image: title.image,
                add_by: userid
            };

            const response = await AddClover(data, token);
            if (response && response.status) {
                showCustomAlert("Success", response.message)
                setTitle({ title: "", add_by: "", image: "" });
                fileInputRef.current.value = "";
                getClover();
                setShowModal(false)

            } else {
                showCustomAlert("error", response.message)
            }
        } catch (error) {
            showCustomAlert("error", "server error")

        }
    };






    const handleSwitchChange = async (event, id) => {
        const user_active_status = event.target.checked ? "true" : "false";
        const data = { id: id, status: user_active_status };
        const result = await showCustomAlert("confirm", "Do you want to save the changes?")
        if (result.isConfirmed) {
            try {
                const response = await changeCloverStatus(data, token);
                if (response.status) {
                    showCustomAlert("Success", "Status Changed")
                }
                getClover();
            } catch (error) {
                showCustomAlert("error", "There was an error processing your request.")
            }
        } else {
            event.target.checked = !user_active_status
            getClover();
        }
    };




    // delete news

    const DeleteCloverlist = async (_id) => {
        try {
            const result = await showCustomAlert("confirm", "Do you want to delete this This action cannot be undone.")
            if (result.isConfirmed) {
                const response = await DeleteClover(_id, token);
                if (response.status) {
                    showCustomAlert("Success", "The Clover has been successfully deleted.")
                    getClover();
                }
            } else {
                showCustomAlert("error", "The Clover deletion was cancelled.")
            }
        } catch (error) {
            showCustomAlert("error", "There was an error deleting the Clover.")

        }
    };

    const columns = [
        // {
        //     name: 'S.No',
        //     selector: (row, index) => index + 1,
        //     sortable: false,
        //     width: '150px',

        // },
        // {
        //     name: 'Title',
        //     selector: row => row.title,
        //     sortable: true,
        // },
        {
            name: "Image",
            cell: (row) => (
                <img
                    src={`${image_baseurl}uploads/banner/${row.image}`}
                    alt={row.image}
                    title={row.image}
                    width="50"
                    height="50"
                />
            ),
            sortable: true,
        },
        {
            name: "Active Status",
            selector: (row) => (
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
            name: "Created At",
            selector: (row) => fDateTime(row.created_at),
            sortable: true,
        },
        // {
        //     name: 'Updated At',
        //     selector: row => fDateTime(row.updated_at),
        //     sortable: true,
        // },

        {
            name: "Actions",
            cell: (row) => (
                <>
                    <div>
                        <Tooltip placement="top" overlay="Update">
                            <SquarePen
                                onClick={() => {
                                    setModel(true);
                                    setServiceid(row);
                                    setUpdatetitle({
                                        title: row.title,
                                        id: row._id,
                                        image: row.image

                                    });
                                }}
                            />
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip placement="top" overlay="Delete">
                            <Trash2 onClick={() => DeleteCloverlist(row._id)} />
                        </Tooltip>
                    </div>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const updateServiceTitle = (updatedField) => {
        setUpdatetitle((prev) => ({
            ...prev,
            ...updatedField,
        }));
    };

    return (
        <div>
            <div className="page-content">
                <div className="page-breadcrumb d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Clover</div>
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
                            <div className="ms-auto">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={(e) => {
                                        setShowModal(true);
                                    }}
                                >
                                    <i className="bx bxs-plus-square" />
                                    Add Clover
                                </button>

                                <ReusableModal
                                    show={showModal}
                                    onClose={() => setShowModal(false)}
                                    title={<>Add Clover</>}
                                    body={
                                        <>
                                            <div className="">
                                                <div className="col-md-12">
                                                    <label htmlFor="title">Title</label>
                                                    <input
                                                        className="form-control mb-2"
                                                        type="text"
                                                        id="title"
                                                        placeholder="Enter link"
                                                        value={title.title}
                                                        onChange={(e) =>
                                                            setTitle({
                                                                ...title,
                                                                title: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <label htmlFor="imageUpload">Upload Image</label>
                                                    <span className="text-danger">*</span>
                                                    <input
                                                        ref={fileInputRef}
                                                        className="form-control mb-3"
                                                        type="file"
                                                        accept="image/*"
                                                        id="imageUpload"
                                                        onChange={(e) =>
                                                            setTitle({
                                                                ...title,
                                                                image: e.target.files[0],
                                                            })
                                                        }
                                                    />
                                                </div>

                                            </div>
                                        </>
                                    }
                                    footer={
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={Addclover}
                                            >
                                                Save
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
                                    title={<> Update Clover</>}
                                    body={
                                        <>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label htmlFor="title">Title</label>
                                                    <input
                                                        className="form-control mb-2"
                                                        type="text"
                                                        placeholder="Enter blog Title"
                                                        value={updatetitle.title}
                                                        onChange={(e) =>
                                                            updateServiceTitle({
                                                                title: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label htmlFor="imageUpload">Image</label>
                                                    <span className="text-danger">*</span>
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
                                                                    typeof updatetitle.image === "string"
                                                                        ? `${image_baseurl}uploads/banner/${updatetitle.image}`
                                                                        : URL.createObjectURL(updatetitle.image)
                                                                }
                                                                alt="Image Preview"
                                                                className="image-preview mt-4"
                                                                style={{
                                                                    width: "68px",
                                                                    height: "auto",
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </>
                                    }
                                    footer={
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={updateClover}
                                            >
                                                Save
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
                        {isLoading ? (
                            <Loader />
                        ) : clients.length > 0 ? (
                            <>
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
                            </>
                        ) : (
                            <div className="text-center mt-5">
                                <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Clover;
