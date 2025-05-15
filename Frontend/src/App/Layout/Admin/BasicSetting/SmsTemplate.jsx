import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSMStemplate, UpdateSMSTemplate } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { fDateTime } from '../../../../Utils/Date_formate';
import { image_baseurl } from '../../../../Utils/config';
import { SquarePen, Trash2, PanelBottomOpen } from 'lucide-react';
import ReusableModal from '../../../components/Models/ReusableModal';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';

const SmsTemplate = () => {


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [model, setModel] = useState(false);

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');


    const [updatetitle, setUpdatetitle] = useState({
        id: "",
        sms_body: "",
        templateid: "",


    });


    const gettemplatelist = async () => {
        try {
            const response = await getSMStemplate(token);
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
            const data = { id: updatetitle.id, templateid: updatetitle.templateid, sms_body: updatetitle.sms_body };

            const response = await UpdateSMSTemplate(data, token);

            if (response && response.status) {
                showCustomAlert("Success", 'Template updated successfully.')
                setUpdatetitle({ title: "", id: "" });
                gettemplatelist();
                setModel(false);
            } else {
                showCustomAlert("error", 'There was an error updating the Template.')

            }
        } catch (error) {
            showCustomAlert("error", 'There was an error updating the Template.')

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
                    <div className="breadcrumb-title pe-3">SMS Template</div>
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
                                            setUpdatetitle({ templateid: client.templateid, id: client._id, sms_body: client.sms_body, });
                                        }}
                                    >
                                        <SquarePen />
                                    </button>
                                    <form className="row g-3">
                                        <div className="col-md-12">
                                            <label htmlFor={`smsType${index}`} className="form-label">
                                                SMS Type
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`smsType${index}`}
                                                value={client.sms_type}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor={`templateid${index}`} className="form-label">
                                                Template ID
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`templateid${index}`}
                                                value={client.templateid}
                                            />
                                        </div>

                                        <div className="col-md-12">
                                            <label htmlFor={`mailContent${index}`} className="form-label">
                                                Mail
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id={`mailContent${index}`}
                                                value={client.sms_body}
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
                                    Template ID
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="templateid"
                                    value={updatetitle.templateid}
                                    onChange={(e) => updateServiceTitle({ templateid: e.target.value })}

                                />
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="mailContent" className="form-label">
                                    SMS
                                </label>
                                <textarea
                                    className="form-control"
                                    id="mailContent"
                                    rows={3}
                                    value={updatetitle.sms_body}
                                    onChange={(e) => updateServiceTitle({ sms_body: e.target.value })}
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

export default SmsTemplate;
