import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getemailtemplate, UpdateTemplate } from '../../../Services/Admin/Admin';
import Swal from 'sweetalert2';
import Table from '../../../Extracomponents/Table';
import { fDateTime } from '../../../../Utils/Date_formate';
import { image_baseurl } from '../../../../Utils/config';
import { SquarePen, Trash2, PanelBottomOpen } from 'lucide-react';
import ReusableModal from '../../../components/Models/ReusableModal';


const Emailtemplate = () => {


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [model, setModel] = useState(false);

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');

    const [templateid, setTemplateid] = useState({})

    const [updatetitle, setUpdatetitle] = useState({
        mail_subject: "",
        id: "",
        mail_body: "",


    });


    const gettemplatelist = async () => {
        try {
            const response = await getemailtemplate(token);
            if (response.status) {
                const filterdata = response.data.filter((item) =>
                    searchInput === "" || item.title.toLowerCase().includes(searchInput.toLowerCase())
                );
                setClients(searchInput ? filterdata : response.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };

    useEffect(() => {
        gettemplatelist();
    }, [searchInput]);


    const updateemaitemplate = async () => {
        try {
            const data = { mail_subject: updatetitle.mail_subject, id: templateid, mail_body: updatetitle.mail_body };

            const response = await UpdateTemplate(data, token);

            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Template updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setUpdatetitle({ title: "", id: "" });
                gettemplatelist();
                setModel(false);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error updating the Template.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the Template.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };


    // Inline CSS styles
    const buttonStyle = {
        width: '40px',
        height: '40px',
        border: 'none',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'absolute',
        top: '10px',
        right: '10px',
    };

    const buttonHoverStyle = {
        ...buttonStyle,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
                    <div className="breadcrumb-title pe-3">Email Template</div>
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
                <div className="row">
                    {clients.map((client, index) => (
                        <div className="col-md-6 col-lg-4" key={index}>
                            <div className="card mb-4">
                                <div className="card-body p-4 position-relative">
                                    <button
                                        style={buttonStyle}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => {
                                            setModel(true);
                                            setTemplateid(client._id);
                                            setUpdatetitle({ mail_subject: client.mail_subject, id: client._id, mail_body: client.mail_body, });
                                        }}
                                    >
                                        <SquarePen />
                                    </button>
                                    <form className="row g-3">
                                        <div className="col-md-12">
                                            <label htmlFor={`mailType${index}`} className="form-label">
                                                Mail Type
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`mailType${index}`}
                                                value={client.mail_type}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor={`subject${index}`} className="form-label">
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`subject${index}`}
                                                value={client.mail_subject}
                                            />
                                        </div>

                                        <div className="col-md-12">
                                            <label htmlFor={`mailContent${index}`} className="form-label">
                                                Mail
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id={`mailContent${index}`}
                                                value={client.mail_body}
                                                rows={3}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ReusableModal
                show={model}
                onClose={() => setModel(false)}
                title="Upload Template"
                body={
                    <div className="modal-body">
                        <form className="row g-3">

                            <div className="col-md-12">
                                <label htmlFor="subject" className="form-label">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="subject"
                                    value={updatetitle.mail_subject}
                                    onChange={(e) => updateServiceTitle({ mail_subject: e.target.value })}

                                />
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="mailContent" className="form-label">
                                    Mail
                                </label>
                                <textarea
                                    className="form-control"
                                    id="mailContent"
                                    rows={3}
                                    value={updatetitle.mail_body}
                                    onChange={(e) => updateServiceTitle({ mail_body: e.target.value })}
                                />
                            </div>
                        </form>


                    </div>
                }
                footer={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setModel(false)}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={updateemaitemplate}>
                            Update Temaplate
                        </button>
                    </>
                }
            />

        </div>
    );
};

export default Emailtemplate;
