import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Table from '../../../Extracomponents/Table';
import { GetmultipleSignalstrategy } from '../../../Services/Admin/Admin';
import { image_baseurl } from '../../../../Utils/config';
import { signalfDateTime, fDateTimeH } from '../../../../Utils/Date_formate';
import { Tooltip } from 'antd';
import { ArrowDownToLine, } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import Content from '../../../components/Contents/Content';



const MultipleSignaldetail = () => {


    const { id } = useParams();
    const token = localStorage?.getItem('token');
    const [data, setData] = useState([]);
    const [currentlocation, setCurrentlocation] = useState({})


    useEffect(() => {
        getsignaldetail();
    }, []);




    const handleDownload = (item) => {
        const url = item.report_full_path;
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const getsignaldetail = async () => {
        try {
            const response = await GetmultipleSignalstrategy(id, token);

            if (response.status) {
                const signalData = response.data;
                setData([signalData]);


            }
        } catch (error) {
            console.log("Error fetching signal details:", error);
        }
    };




    return (

        <Content
            Page_title="Signal Detail"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <div>
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className=" radius-15">
                            <div className="card-body">
                                <div className="">
                                    {data?.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <div className="">
                                                <div className="row">
                                                    <table className="table table-bordered table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>Details</th>
                                                                <th>Information</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>service:</td>
                                                                <td>{item?.service == "OS" ? "Option Startegy" : "Future Startegy" || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Stock Name:</td>
                                                                <td>{item?.stock || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Plan Name:</td>
                                                                <td>{item?.plan_category_title || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>STRATEGY:</td>
                                                                <td>{item?.strategy_name || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Trade Duration:</td>
                                                                <td>{item?.callduration || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Maximum Loss:</td>
                                                                <td>{item?.maximum_loss || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Maximum Profit:</td>
                                                                <td>{item?.maximum_profit || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Required Margin:</td>
                                                                <td>{item?.required_margin || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Exit Price:</td>
                                                                <td>{item?.closeprice == 0 ? "-" : item?.closeprice || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Created At:</td>
                                                                <td>{fDateTimeH(item?.created_at) || '-'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Report:</td>
                                                                <td>
                                                                    {item.report ? (
                                                                        <button
                                                                            style={{ color: "green", cursor: "pointer" }}
                                                                            onClick={() => handleDownload(item)}
                                                                            className='btn btn-secondary'
                                                                        >
                                                                            Download
                                                                            <Tooltip placement="top" overlay="Download">
                                                                                <ArrowDownToLine className='text-success' />
                                                                            </Tooltip>
                                                                        </button>
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>



                                                </div>
                                                <div className="row">
                                                    <div className="col-12 mt-3">
                                                        <div className="card mb-3 shadow p-3" style={{ minWidth: "300px", flex: "0 0 auto" }}>
                                                            <table className="table border-0 border-light signalstrategy-tablen">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Segment</th>
                                                                        <th>Call Type</th>
                                                                        <th>Expiry</th>
                                                                        <th>Option Type</th>
                                                                        <th>Strike Price</th>
                                                                        <th>Price</th>
                                                                        <th>Lots</th>
                                                                        <th>Lot Size</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item.stocks?.map((stock, stockIndex) => (
                                                                        <tr key={stockIndex}>
                                                                            <td>
                                                                                {stock?.segment === 'C' ? "Cash" :
                                                                                    stock?.segment === 'O' ? "Option" :
                                                                                        stock?.segment === 'F' ? "Future" : '-'}
                                                                            </td>
                                                                            <td>{stock?.calltype || '-'}</td>
                                                                            <td>{signalfDateTime(stock?.expirydate) || '-'}</td>
                                                                            <td>{stock?.optiontype || '-'}</td>
                                                                            <td>{stock?.strikeprice == 0 ? "-" : stock?.strikeprice || '-'}</td>
                                                                            <td><IndianRupee size={16} />{stock.price || '-'}</td>
                                                                            <td>{stock?.lot || '-'}</td>
                                                                            <td>{stock?.lotsize || '-'}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 row">

                                                    <div className='col-md-12'>
                                                        <h6 className="mb-2"><strong>Description</strong></h6>
                                                        <textarea
                                                            className="form-control text-secondary "
                                                            style={{ height: "50px" }}
                                                            value={item.description || ''}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </Content >
    );
};

export default MultipleSignaldetail;
