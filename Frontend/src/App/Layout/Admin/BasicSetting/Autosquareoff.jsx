import React, { useEffect, useState } from 'react';
import { basicsettinglist, Updatesquareoffdata } from '../../../Services/Admin/Admin';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ArrowDown } from 'lucide-react';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';

const Autosquareoff = () => {




  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [clients, setClients] = useState(null);


  const getsettingdetail = async () => {
    try {
      const response = await basicsettinglist(token);
      if (response.status) {
        setClients(response.data);
      }
    } catch (error) {
      console.log('Error fetching settings:', error);
    }
  };



  useEffect(() => {
    getsettingdetail();
  }, []);



  const validationSchema = Yup.object().shape({
    cashexpirehours: Yup.string()
      .required('Cash Expire Hours is required')
      .matches(/^[0-9]+$/, 'Only numeric values are allowed')
      .oneOf(['9', '10', '11', '12', '13', '14', '15'], 'Select a valid hour'),
    cashexpiretime: Yup.string()
      .required('Cash Expire Minutes is required')
      .matches(/^[0-9]+$/, 'Only numeric values are allowed')
      .test('is-valid-minute', 'Minutes must be between 0 and 59', (value) => {
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 0 && num <= 59;
      }),
    foexpirehours: Yup.string()
      .required('F&O Expire Hours is required')
      .matches(/^[0-9]+$/, 'Only numeric values are allowed')
      .oneOf(['9', '10', '11', '12', '13', '14', '15'], 'Select a valid hour'),
    foexpiretime: Yup.string()
      .required('F&O Expire Minutes is required')
      .matches(/^[0-9]+$/, 'Only numeric values are allowed')
      .test('is-valid-minute', 'Minutes must be between 0 and 59', (value) => {
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 0 && num <= 59;
      }),
  });




  if (!clients) {
    return <div>Loading...</div>;
  }



  return (
    <div className='page-content'>
      <div className="page-breadcrumb  d-flex align-items-center mb-3">
        <div className="breadcrumb-title pe-3">Auto SquareOff</div>
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
        <div className="col-lg-8 mx-auto">
          <div className="card radius-15">
            <Formik
              enableReinitialize={true}
              initialValues={{
                cashexpiretime: clients[0].cashexpiretime || '',
                foexpiretime: clients[0].foexpiretime || '',
                cashexpirehours: clients[0].cashexpirehours || '',
                foexpirehours: clients[0].foexpirehours || '',
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                const req = {
                  cashexpiretime: values.cashexpiretime,
                  foexpiretime: values.foexpiretime,
                  cashexpirehours: values.cashexpirehours,
                  foexpirehours: values.foexpirehours,
                };

                try {
                  const response = await Updatesquareoffdata(req, token);
                  if (response.status) {
                    showCustomAlert("Success", "Auto Squareoff updated successfully")
                  } else {
                    showCustomAlert("error", response.message)
                  }
                } catch (error) {
                  showCustomAlert("error", "An unexpected error occurred. Please try again later.")
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ dirty, isSubmitting }) => (
                <Form className="card-body">
                  <div className='p-4 border radius-15'>
                    <div className="row">
                      <div className="row mb-3 align-items-center">
                        <div className="col-sm-5">
                          <label htmlFor="cashexpirehours" className="col-form-label">
                            <b>Cash Expire Hours</b>
                          </label>
                          <Field
                            as="select"
                            name="cashexpirehours"
                            className="form-control custom-select"
                            aria-describedby="cashexpirehoursError"
                          >
                            <option value="">Select Expiry Hours</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">1</option>
                            <option value="14">2</option>
                            <option value="15">3</option>
                          </Field>
                          <ErrorMessage name="cashexpirehours" component="div" className="error" id="cashexpirehoursError" />
                        </div>

                        <div className="col-sm-5">
                          <label htmlFor="cashexpiretime" className="col-form-label">
                            <b>Cash Expire Minutes</b>
                          </label>
                          <Field
                            name="cashexpiretime"
                            type="text"
                            className="form-control"
                            aria-describedby="cashexpiretimeError"
                          />
                          <ErrorMessage name="cashexpiretime" component="div" className="error" id="cashexpiretimeError" />
                        </div>
                      </div>

                      <div className="row mb-3 align-items-center">
                        <div className="col-sm-5">
                          <label htmlFor="foexpirehours" className="col-form-label">
                            <b>F&O Expire Hours</b>
                          </label>
                          <Field
                            as="select"
                            name="foexpirehours"
                            className="form-control custom-select"
                            aria-describedby="foexpirehoursError"
                          >
                            <option value="">Select Expiry Hours</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">1</option>
                            <option value="14">2</option>
                            <option value="15">3</option>
                          </Field>
                          <ErrorMessage name="foexpirehours" component="div" className="error" id="foexpirehoursError" />
                        </div>

                        <div className="col-sm-5">
                          <label htmlFor="foexpiretime" className="col-form-label">
                            <b>F&O Expire Minutes</b>
                          </label>
                          <Field
                            name="foexpiretime"
                            type="text"
                            className="form-control"
                            aria-describedby="foexpiretimeError"
                          />
                          <ErrorMessage name="foexpiretime" component="div" className="error" id="foexpiretimeError" />
                        </div>
                      </div>

                      <div className="col-sm-12 mt-3 text-center">
                        <button
                          type="submit"
                          className="btn btn-primary px-4"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>

              )}
            </Formik>

            <style jsx>{`
                          .error {
                            color: red;
                            font-size: 15px;
                            
                          }
                         .custom-select {
  appearance: none; /* Remove default arrow */
  background: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="34" viewBox="0 0 24 24"><path fill="gray" d="M7 10l5 5 5-5z"/></svg>') no-repeat right center;
  background-size: 1em; /* Adjust size of the custom arrow */
  padding-right: 1.5em; /* Space for the custom arrow */
}                            
                        `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Autosquareoff;
