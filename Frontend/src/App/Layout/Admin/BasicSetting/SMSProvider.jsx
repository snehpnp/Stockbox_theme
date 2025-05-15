import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Content from '../../../components/Contents/Content';
import { getSMSProvider, UpdateSMSProvider, UpdateSMSProviderStatus } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import { fDateTime } from '../../../../Utils/Date_formate';
import { image_baseurl } from '../../../../Utils/config';
import { SquarePen, Trash2, PanelBottomOpen } from 'lucide-react';
import ReusableModal from '../../../components/Models/ReusableModal';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';



const SMSProvider = () => {


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


    const getProvider = async () => {
        try {
            const response = await getSMSProvider(token);
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
        getProvider();
    }, [searchInput]);


    const updateemaiProvider = async () => {
        try {
            const data = {
                id: updatetitle.id, name: updatetitle.name, username: updatetitle.username, password: updatetitle.password,
                route: updatetitle.route, entity_id: updatetitle.entity_id, sender: updatetitle.sender, url: updatetitle.url, apikey: updatetitle.apikey
            };

            const response = await UpdateSMSProvider(data, token);

            if (response && response.status) {
                showCustomAlert("Success", 'Template updated successfully.')
                setUpdatetitle({ title: "", id: "" });
                getProvider();
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



    const handleSwitchChange = async (client) => {
        const data = { providerId: client._id };

        const result = await showCustomAlert("confirm", "Do you want to change the status?");
        if (!result.isConfirmed) {
            return getProvider();
        }

        try {
            const response = await UpdateSMSProviderStatus(data, token);
            if (response.status) {
                await showCustomAlert("Success", "Status changed successfully!");
                getProvider();
            }
        } catch (error) {
            showCustomAlert("error", "There was an error processing your request.");
        }
    };








    return (
        <Content
            Page_title='SMS Provider'
            button_status={false}
            backbutton_status={true}
            backForword={true}>
            <div className="page-content">

                <div className="row">
                    {clients.map((client, index) => (
                        <div className="col-md-6 col-lg-4" key={index}>
                            <div className="card mb-4">
                                <div className="card-body p-4 position-relative">
                                    <div className="col-md-5 d-flex ">
                                        <div className="form-check form-switch form-check-info">
                                            <label
                                                htmlFor={`rating_${client?._id}`}
                                                className="checktoggle checkbox-bg"
                                            >
                                                Active Status
                                            </label>
                                            <input
                                                id={`rating_${client?._id}`}
                                                className="form-check-input toggleswitch"
                                                type="checkbox"
                                                disabled={client?.status == 1}
                                                checked={client?.status == 1}
                                                onChange={() => handleSwitchChange(client)}

                                            />

                                        </div>

                                    </div>
                                    <button
                                        style={buttonStyle}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => {
                                            setModel(true);
                                            setUpdatetitle({
                                                apikey: client.apikey, id: client._id, name: client.name, username: client.username, password: client.password,
                                                sender: client.sender, url: client.url, entity_id: client.entity_id, route: client.route
                                            });
                                        }}
                                    >
                                        <SquarePen />
                                    </button>
                                    <hr />
                                    <form className="row g-3">
                                        <div className="col-md-12">
                                            <label htmlFor={`name${index}`} className="form-label">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`name${index}`}
                                                value={client.name}
                                            />
                                        </div>
                                        {client.name === "pushsms" && <div className="col-md-12">
                                            <label htmlFor={`username${index}`} className="form-label">
                                                User Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`username${index}`}
                                                value={client.username}
                                            />
                                        </div>}
                                        {/* <div className="col-md-12">
                                            <label htmlFor={`password${index}`} className="form-label">
                                                Password
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`password${index}`}
                                                value={client.password}
                                            />
                                        </div> */}
                                        <div className="col-md-12">
                                            <label htmlFor={`apikey${index}`} className="form-label">
                                                Auth Key
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`apikey${index}`}
                                                value={client.apikey}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor={`sender${index}`} className="form-label">
                                                Sender
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`sender${index}`}
                                                value={client.sender}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor={`url${index}`} className="form-label">
                                                Url
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`url${index}`}
                                                value={client.url}
                                            />
                                        </div>
                                        {client.name === "pushsms" && <div className="col-md-12">
                                            <label htmlFor={`entity_id${index}`} className="form-label">
                                                Entity Id
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`entity_id${index}`}
                                                value={client.entity_id}
                                            />
                                        </div>}
                                        {client.name !== "pushsms" && <div className="col-md-12">
                                            <label htmlFor={`route${index}`} className="form-label">
                                                Route
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`route${index}`}
                                                value={client.route}
                                            />
                                        </div>}
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
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={updatetitle.name}
                                    disabled
                                    onChange={(e) => updateServiceTitle({ name: e.target.value })}

                                />
                            </div>
                            {updatetitle.name === "pushsms" && <div className="col-md-12">
                                <label htmlFor="username" className="form-label">
                                    User Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={updatetitle.username}
                                    onChange={(e) => updateServiceTitle({ username: e.target.value })}

                                />
                            </div>}
                            {/* <div className="col-md-12">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="password"
                                    value={updatetitle.password}
                                    onChange={(e) => updateServiceTitle({ password: e.target.value })}

                                />
                            </div> */}
                            <div className="col-md-12">
                                <label htmlFor="apikey" className="form-label">
                                    Api Key
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="apikey"
                                    value={updatetitle.apikey}
                                    onChange={(e) => updateServiceTitle({ apikey: e.target.value })}

                                />
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="sender" className="form-label">
                                    Sender
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="sender"
                                    value={updatetitle.sender}
                                    onChange={(e) => updateServiceTitle({ sender: e.target.value })}

                                />
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="url" className="form-label">
                                    Url
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="url"
                                    value={updatetitle.url}
                                    onChange={(e) => updateServiceTitle({ url: e.target.value })}

                                />
                            </div>
                            {updatetitle.name === "pushsms" && <div className="col-md-12">
                                <label htmlFor="entity_id" className="form-label">
                                    Entity ID
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="entity_id"
                                    value={updatetitle.entity_id}
                                    onChange={(e) => updateServiceTitle({ entity_id: e.target.value })}

                                />
                            </div>}
                            {updatetitle.name !== "pushsms" && <div className="col-md-12">
                                <label htmlFor="entity_id" className="form-label">
                                    Route
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="route"
                                    value={updatetitle.route}
                                    onChange={(e) => updateServiceTitle({ route: e.target.value })}

                                />
                            </div>}


                        </form>


                    </div>
                }
                footer={
                    <>
                        <button type="button" className="btn btn-secondary" onClick={() => setModel(false)}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={updateemaiProvider}>
                            Update Temaplate
                        </button>
                    </>
                }
            />

        </Content>
    );
};

export default SMSProvider;
