import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { AddSignalByPlan, GetService, GetStrategySegmentList, getstockbyservice, getPlanbyservice, getexpirydate, getstockStrickprice, MultipleSignaldata, ServiceListStratrgy, StockListStratrgy } from '../../../Services/Admin/Admin';
import { useNavigate } from 'react-router-dom';
import Content from '../../../components/Contents/Content';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';



const MultipleSignal = () => {


    const navigate = useNavigate();
    const user_id = localStorage.getItem('id');
    const token = localStorage.getItem('token');


    const [loading, setLoading] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [serviceStrategy, setServiceStrategy] = useState([]);

    const [stockList, setStockList] = useState([]);
    const [stockListstartegy, setStockstartegy] = useState([]);
    const [expirydate, setExpirydate] = useState([]);
    const [strikePrice, setStrikePrice] = useState([]);
    const [planPrice, setPlanPrice] = useState([]);
    const [searchItem, setSearchItem] = useState("");
    const [selectitem, setSelectitem] = useState("");
    const [showDropdown, setShowDropdown] = useState(true);

    const [expirydateList, setExpirydateList] = useState([]);
    const [strikePriceList, setStrikePriceList] = useState([]);



    const [rows, setRows] = useState([
        {
            segment: "",
            calltype: "",
            expiry: "",
            strikePrice: "",
            optiontype: "",
            lot: "",
            price: "",
        },
        {
            segment: "",
            calltype: "",
            expiry: "",
            strikePrice: "",
            optiontype: "",
            lot: "",
            price: "",
        },
    ]);



    // const handleChange = (index, field, value) => {
    //     const updatedRows = [...rows];
    //     updatedRows[index][field] = value;
    //     setRows(updatedRows);
    // };


    // Inside your component
    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);

        if (["segment", "expiry", "optiontype"].includes(field)) {
            fetchDataForRow(updatedRows[index], index);
        }
    };




    const addRow = () => {
        setRows([
            ...rows,
            {
                segment: "",
                calltype: "",
                expiry: "",
                strikePrice: "",
                optiontype: "",
                lot: "",
                price: "",
            },

        ]);
    };

    const removeRow = (index) => {
        if (index !== 0 && index !== 1) {
            setRows(rows.filter((_, i) => i !== index));
        }
    };




    useEffect(() => {
        fetchAdminServices();
        StratrgyService();
        fetchStockStartegy();
    }, []);





    const fetchAdminServices = async () => {
        try {
            const response = await GetStrategySegmentList(token);
            if (response.status) {
                setServiceList(response.data);
            }
        } catch (error) {
            console.log('Error fetching services:', error);
        }
    };

    const StratrgyService = async () => {
        try {
            const response = await ServiceListStratrgy(token);
            if (response.status) {
                setServiceStrategy(response.data);
            }
        } catch (error) {
            console.log('Error fetching services:', error);
        }
    };



    const fetchStockStartegy = async () => {
        try {
            const data = { symbol: searchItem }
            const response = await StockListStratrgy(data, token);
            if (response.status) {
                setStockstartegy(response.data);
            }
        } catch (error) {
            console.log('Error fetching services:', error);
        }
    };






    const formik = useFormik({
        initialValues: {
            add_by: user_id,
            service: "",
            stock: "",
            stocks: "",
            strategy_name: '',
            description: '',
            callduration: '',
            maximum_loss: '',
            maximum_profit: '',
            required_margin: '',
            report: '',
            planid: '',

        },
        validate: (values) => {

            const errors = {};
            if (!values.service) errors.service = 'Please Select a Segment';
            if (!values.stock) errors.stock = 'Please Select a Stock';

            if (!values.strategy_name) errors.strategy_name = 'Please Enter Strategy Name';
            if (!values.callduration) errors.callduration = 'Please Select Trade Duration';
            if (!values.description) errors.description = 'Please Enter Description';
            if (!values.maximum_loss) errors.maximum_loss = 'Please Enter Maximum Loss';
            if (!values.maximum_profit) errors.maximum_profit = 'Please Enter Maximum Profit';
            if (!values.required_margin) errors.required_margin = 'Please Enter Required Margin';

            if (!values.planid) {
                errors.planid = 'Please Select Plan';
            }
            return errors;
        },



        onSubmit: async (values) => {
            setLoading(!loading)

            const stocks = rows.map(row => ({
                segment: row?.segment || "",
                expirydate: row?.expiry || "",
                price: Number(row?.price) || 0,
                optiontype: row?.optiontype || "",
                calltype: row?.calltype || "",
                lot: row?.lot || 0,
                strikeprice: row?.strikePrice || 0,
            }));


            const req = {
                add_by: user_id,
                service: values.service,
                stock: values.stock,
                stocks: stocks,
                strategy_name: values.strategy_name,
                description: values.description,
                callduration: values.callduration,
                maximum_loss: values.maximum_loss,
                maximum_profit: values.maximum_profit,
                required_margin: values.required_margin,
                report: values.report,
                planid: values.planid,
            };
            try {

                const response = await MultipleSignaldata(req, token);
                if (response.status) {
                    showCustomAlert("Success", response.message, navigate, '/admin/signal')

                } else {
                    showCustomAlert("error", response.message)
                    setLoading(false)
                }
            } catch (error) {
                setLoading(false)
                showCustomAlert("error", 'An unexpected error occurred. Please try again later.')
            }
        }
    });




    useEffect(() => {
        if (formik.values.segment) {
            formik.setValues({
                add_by: user_id,
                service: "",
                stock: "",
                stocks: "",
                strategy_name: '',
                description: '',
                callduration: '',
                maximum_loss: '',
                maximum_profit: '',
                required_margin: '',
                report: '',
                planid: '',
            });

            setSearchItem("")
        }
    }, [formik.values.segment]);



    useEffect(() => {
        if (!searchItem || searchItem.length === 0) {
            Object.keys(formik.values).forEach(field => {
                if (field !== "stock") {
                    formik.setFieldValue("stock", "");
                }
            });
        }
    }, [formik.values.stock, searchItem]);




    const fetchDataForRow = async (row, index) => {
        try {
            if (row.segment && searchItem) {
                // Fetch expiry
                const expiryResponse = await getexpirydate({
                    segment: row.segment,
                    symbol: searchItem,
                });

                if (expiryResponse.status) {
                    const updatedExpiryList = [...expirydateList];
                    updatedExpiryList[index] = expiryResponse.data;
                    setExpirydateList(updatedExpiryList);
                }

                // Fetch strike price only if option
                if (row.segment === "O" && row.expiry && row.optiontype) {
                    const strikeResponse = await getstockStrickprice({
                        segment: row.segment,
                        symbol: searchItem,
                        expiry: row.expiry,
                        optiontype: row.optiontype,
                    });

                    if (strikeResponse.status) {
                        const updatedStrikeList = [...strikePriceList];
                        updatedStrikeList[index] = strikeResponse.data;
                        setStrikePriceList(updatedStrikeList);
                    }
                } else {
                    const updatedStrikeList = [...strikePriceList];
                    updatedStrikeList[index] = [];
                    setStrikePriceList(updatedStrikeList);
                }
            }
        } catch (error) {
            console.log("Error fetching data for row:", error);
        }
    };






    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const data = {
                    symbol: searchItem,
                };

                const stockResponse = await getstockbyservice(data);
                if (stockResponse.status) {
                    setStockList(stockResponse.data);
                }

                const data2 = { serviceId: formik.values.service };
                const planPriceResponse = await getPlanbyservice(data2);
                if (planPriceResponse.status) {
                    setPlanPrice(planPriceResponse.data);
                }

            } catch (error) {
                console.log("Error fetching stock data:", error);
            }
        };

        if (rows.length > 0 && searchItem) {
            fetchStockData();
        }
    }, [searchItem, formik.values.service]);




    const fields = [
        {
            name: 'service',
            label: 'Service',
            type: 'select2',
            label_size: 12,
            multi: true,
            col_size: 6,
            star: true,
            options: serviceList?.map((item) => ({
                label: item.title,
                value: item.segment,
            })),
        },

        {
            name: 'planid',
            label: 'Plan',
            type: 'selectcheckbox',
            label_size: 12,
            multi: true,
            col_size: 6,
            star: true,
            options: planPrice?.map((item) => ({
                label: item.title,
                value: item._id,
            })),
        },
        {
            name: 'strategy_name',
            label: 'STRATEGY',
            type: 'select',
            label_size: 12,
            col_size: 6,
            star: false,
            options: [
                { label: 'BULL SPREAD', value: 'BULL SPREAD' },
                { label: 'BEAR SPREAD', value: 'BEAR SPREAD' },
                { label: 'IRON CONDOR', value: 'IRON CONDOR' },
                { label: 'BUTTERFLY SPREAD', value: 'BUTTERFLY SPREAD' },
                { label: 'PUT PROTECTOR (FUTURE)', value: 'PUT PROTECTOR (FUTURE)' },
                { label: 'CALL PROTECTOR (FUTURE)', value: 'CALL PROTECTOR (FUTURE)' },
                { label: 'SHORT BULL SPREAD', value: 'SHORT BULL SPREAD' },
                { label: 'LONG/SHORT STRADDLE', value: 'LONG/SHORT STRADDLE' },
                { label: 'LONG/SHORT STRANGLE', value: 'LONG/SHORT STRANGLE' }
            ]
        },

        {
            name: 'callduration',
            label: 'Trade Duration',
            type: 'select',
            options: [
                { label: 'Intraday', value: 'Intraday' },
                { label: 'BTST', value: 'BTST' },
                { label: 'Still Expiry Date', value: 'Still Expiry Date' }
            ],
            label_size: 12,
            col_size: 6,
            star: true
        },
        {
            name: 'maximum_loss',
            label: 'Maximum Loss',
            type: 'number',
            label_size: 12,
            col_size: 6,
            star: true,
        },
        {
            name: 'maximum_profit',
            label: 'Maximum Profit',
            type: 'number',
            label_size: 12,
            col_size: 6,
            star: true,
        },
        {
            name: 'required_margin',
            label: 'Required Margin',
            type: 'number',
            label_size: 12,
            col_size: 6,
            star: true,
        },
        {
            name: 'signalstretegy',
            // label: '',
            type: 'signalstretegy',
            label_size: 12,
            col_size: 3,
            star: true,
        },
        {
            name: 'report',
            label: 'Report',
            type: 'file2',
            label_size: 12,
            col_size: 6,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'text5',
            label_size: 12,
            col_size: 6,
            star: true
        },

    ];



    const dropdownStyles = {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        maxHeight: '200px',
        overflowY: 'auto',
        zIndex: 1000,
    };


    const dropdownItemStyles = {
        padding: '8px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #ddd',
    };



    return (
        <Content
            Page_title="Add Mutiple Signal Strategy"
            button_status={false}
            backbutton_status={true}
            backForword={true}
        >
            <DynamicForm
                fields={fields.filter(field => !field.showWhen || field.showWhen(formik.values))}
                // page_title="Add Signal"
                btn_name="Add Strategy"
                btn_name1="Cancel"
                formik={formik}
                sumit_btn={true}
                btn_name1_route="/admin/signal"
                btnstatus={loading}
                additional_field1={
                    <div className="mb-3">
                        <div className="position-relative">
                            <label className="form-label">Select Stock</label>
                            <span className="text-danger">*</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search stock"
                                name="stock"
                                onChange={(e) => setSearchItem(e.target.value)}
                                value={searchItem}
                                onClick={() => setShowDropdown(true)}
                                style={{ cursor: "pointer" }}
                            />

                            {searchItem && stockListstartegy.length > 0 && showDropdown ? (
                                <div className="dropdown-list" style={dropdownStyles}>
                                    {stockListstartegy
                                        .filter((company) =>
                                            company._id.includes(searchItem.toUpperCase())
                                        )
                                        .map((company) => (
                                            <div
                                                key={company._id}
                                                onClick={() => {
                                                    setSearchItem(company._id);
                                                    formik.setFieldValue("stock", company._id);
                                                    setShowDropdown(false);
                                                }}
                                                style={dropdownItemStyles}
                                            >
                                                {company._id}
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : null}

                            {formik.touched.stock &&
                                formik.errors.stock ? (
                                <div style={{ color: "red" }}>
                                    {formik.errors.stock}
                                </div>
                            ) : null}

                        </div>
                    </div>
                }
                additional_field2={
                    <div className="card mb-3 shadow">
                        <div className="card-body">
                            <div className="col-lg-12">
                                <table className="table border-0 border-light signalstrategy-tablen ">
                                    <thead>
                                        <tr>
                                            <td style={{ width: "13%" }}>Segment</td>
                                            <td style={{ width: "13%" }}>Call Type</td>
                                            <td style={{ width: "13%" }}>Expiry</td>
                                            <td style={{ width: "13%" }}>Option Type</td>
                                            <td style={{ width: "13%" }}>Strike Price</td>
                                            <td style={{ width: "13%" }}>Lots</td>
                                            <td style={{ width: "13%" }}>Price</td>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows?.map((row, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={row.segment}
                                                        onChange={(e) => handleChange(index, "segment", e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="F">Future</option>
                                                        <option value="O">Option</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={row.calltype}
                                                        onChange={(e) => handleChange(index, "calltype", e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="BUY">Buy</option>
                                                        <option value="SELL">Sell</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={row?.expiry}
                                                        onChange={(e) => handleChange(index, "expiry", e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select</option>
                                                        {expirydateList[index]?.map((item) => {
                                                            const expiry = item?.expiry;
                                                            const day = expiry.substring(0, 2);
                                                            const month = expiry.substring(2, 4);
                                                            const year = expiry.substring(4, 8);

                                                            const months = [
                                                                "January", "February", "March", "April", "May", "June",
                                                                "July", "August", "September", "October", "November", "December"
                                                            ];
                                                            const monthName = months[parseInt(month, 10) - 1];
                                                            const formattedDate = `${day} ${monthName} ${year}`;

                                                            return (
                                                                <option key={expiry} value={expiry}>
                                                                    {formattedDate}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>


                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={row.optiontype}
                                                        onChange={(e) => handleChange(index, "optiontype", e.target.value)}
                                                        required
                                                        disabled={row.segment === "F"}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="CE">CALL</option>
                                                        <option value="PE">PUT</option>
                                                    </select>
                                                </td>

                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={row?.strikePrice}
                                                        onChange={(e) => handleChange(index, "strikePrice", e.target.value)}
                                                        required
                                                        disabled={row.segment === "F"}
                                                    >
                                                        <option value="">Select</option>
                                                        {strikePriceList[index]?.map((item) => (
                                                            <option key={item.strike} value={item.strike}>
                                                                {item.strike}
                                                            </option>
                                                        ))}
                                                    </select>

                                                </td>

                                                <td>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        value={row.lot}
                                                        onChange={(e) => handleChange(index, "lot", e.target.value)}
                                                        min="1"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        value={row.price}
                                                        onChange={(e) => handleChange(index, "price", e.target.value)}
                                                        min="0"
                                                        required
                                                    />
                                                </td>
                                                {(index !== 0 && index !== 1) && (
                                                    <i
                                                        className="bx bx-trash fs-4 text-danger"
                                                        onClick={() => removeRow(index)}
                                                        style={{ cursor: "pointer" }}
                                                    ></i>
                                                )}

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div>
                                    <button className="btn btn-sm btn-secondary" onClick={addRow} type="button">
                                        Add More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                }
            />
        </Content >
    );
};

export default MultipleSignal;
