import React, { useState, useEffect } from 'react';
import { getPerformerstatus, GetService, getperformacebysegment, getperformacebysegmentwithfilter } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table1';
import Swal from 'sweetalert2';
import { fDateTime } from '../../../../Utils/Date_formate';
import { Link } from 'react-router-dom';
import { Settings2, Eye, IndianRupee } from 'lucide-react';
import { Tooltip } from 'antd';
import { exportToCSV } from '../../../../Utils/ExportData';
import Loader from '../../../../Utils/Loader';
import ReusableModal from '../../../components/Models/ReusableModal';



const Perform = () => {


    
    const token = localStorage.getItem('token');
    const [clients, setClients] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [activeTab, setActiveTab] = useState(null);
    const [servicedata, setServicedata] = useState([]);
    const [closesignal, setClosesignal] = useState([])
    const [description, setDescription] = useState([])
    const [ForGetCSV, setForGetCSV] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [service, setserviceid] = useState("66d2c3bebf7e6dc53ed07626");
    const [showModal, setShowModal] = useState(false);

    //state for loading
    const [isLoading, setIsLoading] = useState(true)

    const [model, setModel] = useState(false)



    useEffect(() => {
        getServiceData();
    }, [currentPage]);



    const getexportfile = async () => {
        try {
            const data = { service_id: service }
            const response = await getperformacebysegment(data, token);
            if (response.status) {
                if (response.data?.length > 0) {
                    const csvArr = response.data?.map((item) => {
                        const entryPrice = item?.price || 0;
                        const exitPrice = item?.closeprice || 0;
                        const lotSize = item?.lotsize || 0;

                        let totalPL = 0;
                        let plPercent = 0;

                        if (item.calltype === "BUY") {
                            totalPL = ((exitPrice - entryPrice) * lotSize).toFixed(2);
                            plPercent = (((exitPrice - entryPrice) / entryPrice) * 100).toFixed(2);
                        } else if (item.calltype === "SELL") {
                            totalPL = ((entryPrice - exitPrice) * lotSize).toFixed(2);
                            plPercent = (((entryPrice - exitPrice) / entryPrice) * 100).toFixed(2);
                        }

                        return {
                            Tradesymbol: item?.tradesymbol || "-",
                            EntryType: item?.calltype || "-",
                            EntryPrice: entryPrice || "-",
                            ExitPrice: exitPrice || "-",
                            TotalProfitAndLoss: `${totalPL} (${plPercent}%)`,
                            EntryDate: fDateTime(item.created_at),
                            ExitDate: fDateTime(item.closedate),
                        };
                    });
                    exportToCSV(csvArr, 'Performance');
                }
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }






    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const getServiceData = async () => {
        try {
            const response = await GetService(token);
            if (response.status) {
                setServicedata(response.data);

                const cashService = response.data.find(service => service.title === "Cash");
                const defaultService = cashService || response.data[0];

                if (defaultService) {
                    setActiveTab(defaultService._id);
                    getperformdata(defaultService._id);
                    getdatabysegment(defaultService._id);
                }
            }
        } catch (error) {
            console.log("Error fetching services:", error);
        }
    };




    const getperformdata = async (service_id) => {
        try {
            const response = await getPerformerstatus(token, service_id);
            if (response.status) {
                setClients([response.data]);

            }
        } catch (error) {
            console.log("Error fetching performance data:", error);
        }
        setIsLoading(false)
    };




    const getdatabysegment = async (service_id) => {
        try {
            const data = { service_id, page: currentPage }
            const response = await getperformacebysegmentwithfilter(data, token);
            if (response.status) {
                setClosesignal(response.data);
                setTotalRows(response.pagination.totalRecords)
            }
        } catch (error) {
            console.log("Error fetching performance data:", error);
        }
        setIsLoading(false)
    };


    const handleViewClick = (description) => {
        setDescription({ description });
    };





    const columns1 = [
        {
            name: 'S.No',
            selector: (row, index) => (currentPage - 1) * 10 + index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Tradesymbol',
            selector: row => row.tradesymbol,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Entry Type',
            selector: row => row.calltype,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Entry price',
            selector: row => <div> <IndianRupee />{row.price}</div>,
            sortable: true,
            width: '200px',
        },

        {
            name: 'Exit Price',
            selector: row => <div> <IndianRupee />{row.closeprice}</div>,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Total P&L (%)',
            cell: row => {
                let totalPL = 0;
                let plPercent = 0;

                if (row.calltype === "BUY") {
                    totalPL = ((row.closeprice - row.price) * row.lotsize).toFixed(2);
                    plPercent = (((row.closeprice - row.price) / row.price) * 100).toFixed(2);
                } else if (row.calltype === "SELL") {
                    totalPL = ((row.price - row.closeprice) * row.lotsize).toFixed(2);
                    plPercent = (((row.price - row.closeprice) / row.price) * 100).toFixed(2);
                }

                const style = {
                    color: totalPL < 0 ? 'red' : 'green',
                };

                return (
                    <span style={style}>
                        {totalPL} ({plPercent}%)
                    </span>
                );
            },
            sortable: true,
            width: '200px',
        },
        {
            name: 'Entry Date',
            selector: row => fDateTime(row.created_at),
            sortable: true,
            width: '200px',
        },

        {
            name: 'Exit Date',
            selector: row => fDateTime(row.closedate),
            sortable: true,
            width: '200px',
        },
        {
            name: 'Actions',
            selector: (row) => (
                <div className='d-flex'>


                    <Tooltip title="view">
                        <Eye
                            onClick={() => {
                                handleViewClick([row.description]);
                                setShowModal(true);
                            }} />
                    </Tooltip>


                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '165px',
        }

    ];






    const renderTable1 = () => {
        const activeService = servicedata.find(service => service._id === activeTab);
        return (
            <div className="table-responsive">
                <h5>{activeService ? `Performance for ${activeService.title}` : 'Performance'}</h5>
                <Table columns={columns1}
                    data={closesignal}
                    totalRows={totalRows}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        );
    };




    const handleTabClick = (serviceId) => {
        setActiveTab(serviceId);
        getperformdata(serviceId);
        getdatabysegment(serviceId)
        setserviceid(serviceId)
    };




    return (
        <div>
            <div className='page-content'>
                <div className="page-breadcrumb d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">Performance Status</div>
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

                {isLoading ? (
                    <Loader />
                ) : (
                    <>

                        <div className='card'>
                            <div className='card-body'>
                                <div className="tab-content" id="myTabContent3">
                                    <div className="tab-pane fade show active" id="NavPills">
                                        <div className="card-body pt-0">
                                            <ul className="nav nav-pills nav-pills1 mb-4 light">
                                                {servicedata.map((service) => (
                                                    <li className="nav-item" key={service._id}>
                                                        <button
                                                            className={`nav-link navlink ${activeTab === service._id ? 'active' : ''}`}
                                                            onClick={() => handleTabClick(service._id)}
                                                        >
                                                            {service.title}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="row">
                                                        <div>

                                                            <div className="card radius-10 w-100" >
                                                                {clients && clients.map((item) => (
                                                                    <div className="card-body p-0" style={{ border: "1px solid grey" }}>
                                                                        <div className="row g-0 row-group text-center" style={{ borderBottom: "1px solid grey" }}>
                                                                            <div className="col-lg-6">

                                                                                <div className="p-3">
                                                                                    <b className="mb-0">Avg.return / trade</b>
                                                                                    <small className="mb-0">
                                                                                        {item?.avgreturnpertrade?.toFixed(2)}

                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-6 ">
                                                                                <div className="p-3">
                                                                                    <b className="mb-0">  Avg.return / month</b>
                                                                                    <small className="mb-0">
                                                                                        {item?.avgreturnpermonth?.toFixed(2)}
                                                                                    </small>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div className='p-3'>
                                                                            <b className='text-black p-0'>Ideal Hit Accuracy</b><br />
                                                                            <b className='text-black p-0'>Ideal Hit Closed : <small className="mb-0">
                                                                                {item?.count}

                                                                            </small></b><br />


                                                                        </div>

                                                                        <div className="d-flex p-3 justify-content-between align-items-center ms-auto font-13 gap-2">
                                                                            <span className="border px-1 rounded cursor-pointer">
                                                                                <i className="bx bxs-circle me-1 text-success" />
                                                                                Hit: {item?.profitCount}
                                                                            </span>
                                                                            <span className="border px-1 rounded cursor-pointer">
                                                                                <i className="bx bxs-circle me-1 text-danger" />
                                                                                Miss: {item?.lossCount}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}


                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                                <div
                                                    className="ms-2"
                                                    onClick={(e) => getexportfile()}
                                                >
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary float-end"
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        title="Export To Excel"
                                                        delay={{ show: "0", hide: "100" }}

                                                    >
                                                        <i className="bx bxs-download" aria-hidden="true"></i>

                                                        Export-Excel
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="tab-content">
                                                <div id="navpills" className="tab-pane active">
                                                    {renderTable1()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                )}


                <ReusableModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    title="Description"
                    body={<p>{description?.description || "No description available."}</p>}
                />

            </div>
        </div>
    );
};

export default Perform;