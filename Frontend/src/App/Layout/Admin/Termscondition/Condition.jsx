import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getconsitionlist, UpdateCondition } from '../../../Services/Admin/Admin';
import Swal from 'sweetalert2';
import { SquarePen, } from 'lucide-react';
import Loader from '../../../../Utils/Loader';


const Condition = () => {


    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [model, setModel] = useState(false);

    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');

    const [templateid, setTemplateid] = useState({})

    //state for Loading
    const [isLoading, setIsLoading] = useState(true)

    const [updatetitle, setUpdatetitle] = useState({
        title: "",
        description: "",
        id: "",


    });


    const gettemplatelist = async () => {
        try {
            const response = await getconsitionlist(token);
            if (response.status) {
                const filterdata = response.data.filter((item) =>
                    searchInput === "" || item.title.toLowerCase().includes(searchInput.toLowerCase())
                );
                setClients(searchInput ? filterdata : response.data);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
        setTimeout(()=>{
            setIsLoading(false)
        })
    };

    useEffect(() => {
        gettemplatelist();
    }, [searchInput]);





    const updateemaitemplate = async () => {
        try {
            const data = { description: updatetitle.description, id: templateid, title: updatetitle.title };

            const response = await UpdateCondition(data, token);

            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'bolgs updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });

                setUpdatetitle({ title: "", id: "", description: "" });
                gettemplatelist();
                setModel(false);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error updating the blogs.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error updating the blogs.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };



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
        <div className='policy-content'>
            <div className="page-content">
                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Policy page</div>
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
                {isLoading ? (
                                                <Loader />
                                            ):(
                                                <>
                                               
                    {clients.map((client, index) => (
                        <div className="col-md-6 col-lg-12" key={index}>
                            <div className="mb-4 card radius-15">
                                <div className="card-body p-md-4 p-2 position-relative">
                                    <div className='p-4 border radius-15'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div>
                                                <h5 class="m-0">
                                                    {client.title}</h5>
                                            </div>
                                            <div>

                                                <SquarePen onClick={() => {
                                                    navigate("/admin/updatecondition", { state: { client } })
                                                }} />

                                            </div>

                                        </div>
                                        <hr />

                                        <form className="row g-3">
                                            


                                            <div className="col-md-12">
                                                <label htmlFor={`mailContent${index}`} className="form-label">
                                                    Description
                                                </label>

                                                <span
                                                    dangerouslySetInnerHTML={{ __html: client.description }}
                                                    style={{ display: 'block', marginTop: '0.5rem' }}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                 </>
                )}
                </div>
            </div>

            {model && (
                <>
                    <div className="modal-backdrop fade show"></div>
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
                                        Update Condition
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setModel(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <form className="row g-3">

                                        {/* <div className="col-md-12">
                                            <label htmlFor="subject" className="form-label">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="subject"
                                                value={updatetitle.title}
                                                onChange={(e) => updateServiceTitle({ title: e.target.value })}

                                            />
                                        </div> */}

                                        <div className="col-md-12">
                                            <label htmlFor="mailContent" className="form-label">
                                                Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="mailContent"
                                                rows={3}
                                                value={updatetitle.description}
                                                onChange={(e) => updateServiceTitle({ description: e.target.value })}
                                            />
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
                                        onClick={updateemaitemplate}
                                    >
                                        Update Condition
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}


        </div>
    );
};
export default Condition;
