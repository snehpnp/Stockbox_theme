import React, { useEffect, useState } from 'react';
import { addfreeClient, basicsettinglist, getfreetrialstatus } from '../../../Services/Admin/Admin';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Table from '../../../Extracomponents/Table';
import { fDateTime } from '../../../../Utils/Date_formate';
import ExportToExcel from '../../../../Utils/ExportCSV';

const FreetrialStatus = () => {
  const token = localStorage.getItem('token');

  const [ForGetCSV, setForGetCSV] = useState([]);
  const [data, setData] = useState([]);
  const [addStatus, setAddStatus] = useState({
    id: '',
    freetrial: '1',
  });
  const [initialFreeTrial, setInitialFreeTrial] = useState('1');
  const [disableUpdate, setDisableUpdate] = useState(true);

  useEffect(() => {
    getApidetail();
    getstatusdetail();
  }, []);

  useEffect(() => {
    forCSVdata();
  }, [data]);

  const forCSVdata = () => {
    if (data?.length > 0) {
      const csvArr = data.map((item) => ({
        CurrentDays: item.newdays,
        PreviousDays: item.olddays || '',
        CreatedAt: item.createdAt || '',
      }));
      setForGetCSV(csvArr);
    }
  };

  const getstatusdetail = async () => {
    try {
      const response = await basicsettinglist(token);
      if (response?.status && response?.data) {
        const defaultTrial = response.data.length > 0 ? response.data[0].freetrial : '1';
        setAddStatus((prevState) => ({ ...prevState, freetrial: defaultTrial }));
        setInitialFreeTrial(defaultTrial);
        setDisableUpdate(true);
      }
    } catch (error) {
      console.log('Error fetching basic settings:', error);
    }
  };

  const getApidetail = async () => {
    try {
      const response = await getfreetrialstatus(token);
      if (response?.status && response?.data) {
        setData(response.data);
        const defaultTrial = response.data.length > 0 ? response.data[0].freetrial : '1';
        setAddStatus((prevState) => ({ ...prevState, freetrial: defaultTrial }));
        setInitialFreeTrial(defaultTrial);
        setDisableUpdate(true);
      }
    } catch (error) {
      console.log('Error fetching free trial status:', error);
    }
  };

  const UpdateClientstatus = async () => {
    try {
      const data = {
        freetrial: addStatus.freetrial,
      };

      const response = await addfreeClient(data, token);

      if (response?.status) {
        Swal.fire({
          icon: 'success',
          title: 'Free Trial Update Successful!',
          text: 'Your Free Trial Status updated successfully.',
          timer: 1500,
          timerProgressBar: true,
        });
        setInitialFreeTrial(addStatus.freetrial);
        setDisableUpdate(true);
        getApidetail();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the API information. Please try again.',
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setAddStatus((prevState) => ({ ...prevState, freetrial: value }));
    setDisableUpdate(value === initialFreeTrial);
  };

  const columns = [
    // {
    //   name: 'S.No',
    //   selector: (row, index) => index + 1,
    //   sortable: false,
    //   width: '200px',
    // },
    {
      name: 'Previous Status',
      selector: (row) => `${row.olddays} Day`,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Updated Status',
      selector: (row) => `${row.newdays} Day`,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Created At',
      selector: (row) => fDateTime(row.createdAt),
      sortable: true,
      width: '200px',
    },
    {
      name: 'Updated At',
      selector: (row) => fDateTime(row.updatedAt),
      sortable: true,
      width: '200px',
    },
  ];

  return (
    <div>
      <div className="page-content">
        <div className="page-breadcrumb  d-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Free Trial Status</div>
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
            <label htmlFor="" className="mb-1">Select Free Days Trial</label>
            <div className="col-lg-4 d-flex">
              <select
                className="form-select"
                value={addStatus.freetrial}
                onChange={(e) => handleSelectChange(e)}
              >
                <option value="" disabled>
                  Select days
                </option>
                {[...Array(7)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1} day{index > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-primary ms-2"
                onClick={UpdateClientstatus}
                disabled={disableUpdate} // Disable button when needed
              >
                Update
              </button>
            </div>
            <div className="ms-2 float-lg-end mt-lg-0 mt-5" style={{ position: 'relative', top: '-38px' }}>
              <ExportToExcel
                className="btn btn-primary"
                apiData={ForGetCSV}
                fileName="All Users"
              />
            </div>
            <div className="table-responsive  d-flex justify-content-center">
              <Table
                columns={columns}
                data={data}
                pagination
                striped
                highlightOnHover
                dense
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreetrialStatus;
