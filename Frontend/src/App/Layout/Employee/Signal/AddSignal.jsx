import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import DynamicForm from '../../../Extracomponents/FormicForm';
import { AddSignalByAdmin, GetService, getstockbyservice, getexpirydate, getstockStrickprice } from '../../../Services/Admin/Admin';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Content from '../../../components/Contents/Content';



const AddSignal = () => {


  const navigate = useNavigate();
  const user_id = localStorage.getItem('id');
  const token = localStorage.getItem('token');


  const [loading, setLoading] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [expirydate, setExpirydate] = useState([]);
  const [strikePrice, setStrikePrice] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [selectitem, setSelectitem] = useState("");
  const [showDropdown, setShowDropdown] = useState(true);

  



  useEffect(() => {
    fetchAdminServices();
  }, []);



  const fetchAdminServices = async () => {
    try {
      const response = await GetService(token);
      if (response.status) {
        setServiceList(response.data);
      }
    } catch (error) {
      console.log('Error fetching services:', error);
    }
  };




  const formik = useFormik({
    initialValues: {
      add_by: user_id,
      segment: '',
      price: '',
      stock: '',
      tag1: '',
      tag2: '',
      tag3: '',
      stoploss: '',
      report: '',
      description: '',
      callduration: '',
      calltype: '',
      expiry: '',
      optiontype: '',
      strikeprice: '',
      entrytype: '',
      lot: '',
      tradesymbol: expirydate[0]?.stock?.tradesymbol || "",
      lotsize: expirydate[0]?.stock?.lotsize || ""

    },
    validate: (values) => {
      const errors = {};
      if (!values.segment) errors.segment = 'Please Select a Segment';
      if (!values.stock) errors.stock = 'Please Select a Stock';
      if (values.price <= 0) {
        errors.price = 'Price Should Be Grater Than Zero'
      }
      if (!values.price) errors.price = 'Please Select a Price';
      if (!values.tag1) errors.tag1 = 'Please Enter Target1';
      if (values.calltype === "BUY") {

        if (values.price && values.tag1 && values.price > values.tag1) {
          errors.tag1 = "Please Enter Greater Than Entry Price";
        }

        if (values.tag2 && values.tag1 > values.tag2) {
          errors.tag2 = "Please Enter Greater Than Target1";
        }

        if (values.tag3 && values.tag2 && values.tag2 > values.tag3) {
          errors.tag3 = "Please Enter Greater Than Target2";
        }

        if (values.stoploss && values.price < values.stoploss) {
          errors.stoploss = "Please Enter Less Than Entry Price";
        }

      } else if (values.calltype === "SELL") {

        if (values.price && values.tag1 && values.price < values.tag1) {
          errors.tag1 = "Please Enter Less Than Entry Price";
        }

        if (values.tag2 && values.tag1 < values.tag2) {
          errors.tag2 = "Please Enter Less Than Target1";
        }

        if (values.tag3 && values.tag2 && values.tag2 < values.tag3) {
          errors.tag3 = "Please Enter Less Than Target2";
        }

        if (values.stoploss && values.price > values.stoploss) {
          errors.stoploss = "Please Enter Greater Than Entry Price";
        }
      }
      if (!values.stoploss) errors.stoploss = 'Please Enter Stoploss';
      if (!values.callduration) errors.callduration = 'Please Select Trade Duration';
      if (!values.calltype) errors.calltype = 'Please select call type';
      if (!values.description) errors.description = 'Please Enter Description';

      if (values.segment === "O" && !values.optiontype) {
        errors.optiontype = 'Please Enter Option Type';
      }

      if ((values.segment === "O" || values.segment === "F") && !values.expiry) {
        errors.expiry = 'Please Enter Expiry Date';
      }

      if (values.segment === "O" && !values.strikeprice) {
        errors.strikePrice = 'Please Select Strike Price';
      }
      if (!values.entrytype) {
        errors.entrytype = 'Please Select Entry Type';
      }

      // if (!values.lot) {
      //   errors.lot = 'Please Enter Lot';
      // }
      if (values.lot && values.lot <= 0) {
        errors.lot = 'Please Enter Greater Than Zero';
      }

      return errors;
    },



    onSubmit: async (values) => {
      setLoading(!loading)
      const req = {
        add_by: user_id,
        tradesymbol: expirydate[0]?.stock?.tradesymbol || "",
        lotsize: expirydate[0]?.stock?.lotsize || "",
        stock: values.stock,
        price: values.price,
        tag1: values.tag1,
        tag2: values.tag2,
        tag3: values.tag3,
        stoploss: values.stoploss,
        description: values.description,
        report: values.report,
        calltype: values.calltype,
        callduration: values.callduration,
        expirydate: values.expiry,
        segment: values.segment,
        optiontype: values.optiontype,
        strikeprice: values.strikeprice,
        entrytype: values.entrytype,
        lot: values.lot,
      };

      try {
        const response = await AddSignalByAdmin(req, token);
        if (response.status) {
          Swal.fire({
            title: 'Create Successful!',
            text: response.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate('/employee/signal');

          }, 2000);


        } else {
          Swal.fire({
            title: 'Alert',
            text: response.message,
            icon: 'warning',
            timer: 1500,
            timerProgressBar: true,
          });

          setLoading(false)
        }
      } catch (error) {
        setLoading(false)

        Swal.fire({
          title: 'Error',
          text: 'An unexpected error occurred. Please try again later.',
          icon: 'error',
          timer: 1500,
          timerProgressBar: true,
        });
      }
    }
  });




  useEffect(() => {
    if (formik.values.segment) {
      formik.setValues({
        add_by: user_id,
        segment: formik.values.segment,
        price: '',
        stock: '',
        tag1: '',
        tag2: '',
        tag3: '',
        stoploss: '',
        report: '',
        description: '',
        callduration: '',
        calltype: '',
        expiry: '',
        optiontype: '',
        strikeprice: '',
        tradesymbol: '',
        lotsize: '',
        entrytype: '',
        lot: ''
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




  useEffect(() => {
    const fetchStockData = async () => {

      const data = { segment: formik.values.segment, symbol: searchItem };
      try {
        const stockResponse = await getstockbyservice(data);
        if (stockResponse.status) {
          setStockList(stockResponse.data);
        } else {
          console.log("Failed to fetch stock data", stockResponse);
        }

        const expiryResponse = await getexpirydate(data);
        if (expiryResponse.status) {
          setExpirydate(expiryResponse.data);
        } else {
          console.log("Failed to fetch expiry date", expiryResponse);
        }


        const data1 = { ...data, expiry: formik.values.expiry, optiontype: formik.values.optiontype };
        const strikePriceResponse = await getstockStrickprice(data1);
        if (strikePriceResponse.status) {
          setStrikePrice(strikePriceResponse.data);
        } else {
          console.log("Failed to fetch strike price", strikePriceResponse);
        }
      } catch (error) {
        console.log("Error fetching stock or expiry date:", error);
      }
    };

    fetchStockData();
  }, [formik.values.segment, searchItem, formik.values.expiry, formik.values.optiontype]);




  const fields = [
    {
      name: 'segment',
      label: 'Segment',
      type: 'select2',
      options: [
        { label: 'Cash', value: 'C' },
        { label: 'Future', value: 'F' },
        { label: 'Option', value: 'O' },
      ],
      label_size: 12,
      col_size: 6,
      star: true
    },


    {
      name: 'expiry',
      label: 'Expiry Date',
      type: 'select',
      label_size: 12,
      col_size: 6,
      star: true,
      options: expirydate.map((item) => ({
        label: item.expiry,
        value: item.expiry,
      })),
      showWhen: (values) => values.segment !== "C",
    },
    {
      name: 'optiontype',
      label: 'Option Type',
      type: 'select',
      options: [
        { label: 'Put', value: 'PE' },
        { label: 'Call', value: 'CE' },
      ],
      label_size: 12,
      col_size: 6,
      star: true,
      showWhen: (values) => values.segment === "O",
    },
    {
      name: 'calltype',
      label: 'Call Type',
      type: 'select',
      options: [
        { label: 'Buy', value: 'BUY' },
        { label: 'Sell', value: 'SELL' },
      ],
      label_size: 12,
      col_size: 6,
      star: true
    },
    {
      name: 'strikeprice',
      label: 'Strike Price',
      type: 'select',
      label_size: 12,
      col_size: 6,
      star: true,
      options: strikePrice.map((item) => ({
        label: item.stock.strike,
        value: item.stock.strike,
      })),
      showWhen: (values) => values.segment === "O"
    },
    {
      name: 'entrytype',
      label: 'Entry Type',
      type: 'select',
      options: [
        { label: 'At', value: 'At' },
        { label: 'Above', value: 'Above' },
        { label: 'Below', value: 'Below' },
      ],
      label_size: 12,
      col_size: 6,
      star: true
    },
    {
      name: 'callduration',
      label: 'Trade Duration',
      type: 'select',
      options: (() => {
        if (formik.values.segment === "C") {
          return formik.values.calltype === "SELL" ? [
            { label: 'Intraday', value: 'Intraday' }
          ] : [
            { label: 'Short Term (15-30 Days)', value: 'Short Term' },
            { label: 'Medium Term (Above 3 Month)', value: 'Medium Term' },
            { label: 'Long Term (Above 1 year)', value: 'Long Term' },
            { label: 'Intraday', value: 'Intraday' }
          ];
        } else if (formik.values.segment === "F") {
          return formik.values.calltype === "SELL" ? [
            { label: 'Short Term', value: 'Short Term' },
            { label: 'Intraday', value: 'Intraday' },
            { label: 'Still Expiry Date', value: 'Still Expiry Date' }
          ] : [
            { label: 'Short Term', value: 'Short Term' },
            { label: 'Intraday', value: 'Intraday' },
            { label: 'Still Expiry Date', value: 'Still Expiry Date' }
          ];
        } else if (formik.values.segment === "O") {
          return [
            { label: 'Short Term', value: 'Short Term' },
            { label: 'Intraday', value: 'Intraday' },
            { label: 'Still Expiry Date', value: 'Still Expiry Date' }
          ];
        }
        return [];
      })(),
      label_size: 12,
      col_size: 6,
      star: true
    },
    {
      name: 'price',
      label: 'Entry Price',
      type: 'number',
      label_size: 12,
      col_size: 6,
      star: true
    },
    {
      name: 'lot',
      label: 'Suggested Quantity/Lot',
      type: 'number',
      label_size: 12,
      col_size: 6,
      star: false
    },



    {
      name: 'tag1',
      label: 'Target-1',
      type: 'number',
      label_size: 6,
      col_size: 3,
      star: true
    },
    {
      name: 'tag2',
      label: 'Target-2',
      type: 'number',
      label_size: 12,
      col_size: 3,

    },
    {
      name: 'tag3',
      label: 'Target-3',
      type: 'number',
      label_size: 12,
      col_size: 3,
    },
    {
      name: 'stoploss',
      label: 'Stoploss',
      type: 'number',
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
        Page_title="Add Signal"
        button_status={false}
        backbutton_status={true}
        backForword={true}
      >
      <DynamicForm
        fields={fields.filter(field => !field.showWhen || field.showWhen(formik.values))}
        // page_title="Add Signal"
        btn_name="Add Signal"
        btn_name1="Cancel"
        formik={formik}
        sumit_btn={true}
        btn_name1_route="/employee/signal"
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

              {searchItem && stockList.length > 0 && showDropdown ? (
                <div className="dropdown-list" style={dropdownStyles}>
                  {stockList
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
      />
      </Content>
    
  );
};

export default AddSignal;
