import React, { useState, useEffect } from 'react';
import Content from '../../../components/Contents/Content';
import { getSMSProvider, UpdateSMSProvider, UpdateSMSProviderStatus } from '../../../Services/Admin/Admin';
import ReusableModal from '../../../components/Models/ReusableModal';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';
import { SquarePen } from 'lucide-react';

const SMSProvider = () => {


    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [model, setModel] = useState(false);
    const token = localStorage.getItem('token');


    const [updateData, setUpdateData] = useState({
        id: "",
        name: "",
        username: "",
        password: "",
        route: "",
        entity_id: "",
        sender: "",
        url: "",
        apikey: ""
    });



    const getProvider = async () => {
        try {
            const response = await getSMSProvider(token);
            if (response.status) {
                const filtered = response.data.filter((item) =>
                    searchInput === "" || item.title.toLowerCase().includes(searchInput.toLowerCase())
                );
                setClients(filtered);
            }
        } catch (error) {
            console.log("Error fetching providers:", error);
        }
    };



    useEffect(() => {
        getProvider();
    }, [searchInput]);


    const handleSwitchChange = async (client) => {
        const data = { providerId: client._id };
        const result = await showCustomAlert("confirm", "Do you want to change the status?");
        if (!result.isConfirmed) return getProvider();
        try {
            const response = await UpdateSMSProviderStatus(data, token);
            if (response.status) {
                await showCustomAlert("Success", "Status changed successfully!");
                getProvider();
            }
        } catch (err) {
            showCustomAlert("error", "There was an error processing your request.");
        }

    };


    const updateServiceTitle = (updatedField) => {
        setUpdateData((prev) => ({ ...prev, ...updatedField }));
    };

    const updateSMSProvider = async () => {
        try {
            const response = await UpdateSMSProvider(updateData, token);
            if (response && response.status) {
                showCustomAlert("Success", "Template updated successfully.");
                setUpdateData({ id: "", name: "", username: "", password: "", route: "", entity_id: "", sender: "", url: "", apikey: "" });
                getProvider();
                setModel(false);
            } else {
                showCustomAlert("error", "There was an error updating the Template.");
            }
        } catch {
            showCustomAlert("error", "There was an error updating the Template.");
        }
    };

    return (
        <Content Page_title="SMS Provider"
            button_status={false}
            backbutton_status={true}
            backForword={true}>
            <div className="page-content row">
                {clients.map((client, index) => (
                    <div className="col-md-6 col-lg-4" key={client._id}>
                        <div className="card mb-4">
                            <div className="card-body p-4 position-relative">
                                <div className="d-flex justify-content-between align-items-start">
                                    <label className="form-check-label">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={client.status === 1}
                                            disabled={client.status === 1}
                                            onChange={() => handleSwitchChange(client)}
                                        />
                                        Active Status
                                    </label>
                                    <button
                                        className="btn"
                                        onClick={() => {
                                            setModel(true);
                                            setUpdateData({
                                                id: client._id,
                                                name: client.name,
                                                username: client.username,
                                                password: client.password,
                                                route: client.route,
                                                entity_id: client.entity_id,
                                                sender: client.sender,
                                                url: client.url,
                                                apikey: client.apikey
                                            });
                                        }}
                                    >
                                        <SquarePen />
                                    </button>
                                </div>
                                <hr />
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text"
                                        className="form-control"
                                        value={client.name}
                                        disabled />
                                </div>
                                {['pushsms', 'smartping'].includes(client.name) && (
                                    <div className="form-group">
                                        <label>User Name</label>
                                        <input type="text"
                                            className="form-control"
                                            value={client.username}
                                            disabled />
                                    </div>
                                )}
                                {client.name === 'smartping' && (
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="text"
                                            className="form-control"
                                            value={client.password}
                                            disabled />
                                    </div>
                                )}
                                {client.name !== 'smartping' && (
                                    <div className="form-group">
                                        <label>Auth Key</label>
                                        <input type="text"
                                            className="form-control"
                                            value={client.apikey}
                                            disabled />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Sender</label>
                                    <input type="text"
                                        className="form-control"
                                        value={client.sender}
                                        disabled />
                                </div>
                                <div className="form-group">
                                    <label>URL</label>
                                    <input type="text"
                                        className="form-control"
                                        value={client.url}
                                        disabled />
                                </div>
                                {['pushsms', 'smartping'].includes(client.name) ? (
                                    <div className="form-group">
                                        <label>Entity ID</label>
                                        <input type="text"
                                            className="form-control"
                                            value={client.entity_id}
                                            disabled />
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>Route</label>
                                        <input type="text"
                                            className="form-control"
                                            value={client.route}
                                            disabled />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ReusableModal
                show={model}
                onClose={() => setModel(false)}
                title="Update Template"
                body={
                    <form className="row g-3">
                        <div className="col-md-12">
                            <label>Name</label>
                            <input type="text"
                                className="form-control"
                                value={updateData.name}
                                disabled />
                        </div>
                        {['pushsms', 'smartping'].includes(updateData.name) && (
                            <div className="col-md-12">
                                <label>User Name</label>
                                <input type="text"
                                    className="form-control"
                                    value={updateData.username}
                                    onChange={(e) => updateServiceTitle({ username: e.target.value })} />
                            </div>
                        )}
                        {updateData.name === 'smartping' && (
                            <div className="col-md-12">
                                <label>Password</label>
                                <input type="text"
                                    className="form-control"
                                    value={updateData.password}
                                    onChange={(e) => updateServiceTitle({ password: e.target.value })} />
                            </div>
                        )}
                        {updateData.name !== 'smartping' && (
                            <div className="col-md-12">
                                <label>API Key</label>
                                <input type="text"
                                    className="form-control"
                                    value={updateData.apikey}
                                    onChange={(e) => updateServiceTitle({ apikey: e.target.value })} />
                            </div>
                        )}
                        <div className="col-md-12">
                            <label>Sender</label>
                            <input type="text"
                                className="form-control"
                                value={updateData.sender}
                                onChange={(e) => updateServiceTitle({ sender: e.target.value })} />
                        </div>
                        <div className="col-md-12">
                            <label>URL</label>
                            <input type="text"
                                className="form-control"
                                value={updateData.url}
                                onChange={(e) => updateServiceTitle({ url: e.target.value })} />
                        </div>
                        {['pushsms', 'smartping'].includes(updateData.name) ? (
                            <div className="col-md-12">
                                <label>Entity ID</label>
                                <input type="text"
                                    className="form-control"
                                    value={updateData.entity_id}
                                    onChange={(e) => updateServiceTitle({ entity_id: e.target.value })} />
                            </div>
                        ) : (
                            <div className="col-md-12">
                                <label>Route</label>
                                <input type="text"
                                    className="form-control"
                                    value={updateData.route}
                                    onChange={(e) => updateServiceTitle({ route: e.target.value })} />
                            </div>
                        )}
                    </form>
                }
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setModel(false)}>Close</button>
                        <button className="btn btn-primary" onClick={updateSMSProvider}>Update Template</button>
                    </>
                }
            />
        </Content>
    );
};

export default SMSProvider;
