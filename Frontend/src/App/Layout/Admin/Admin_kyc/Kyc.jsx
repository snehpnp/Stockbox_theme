import React from 'react';
import { Link } from 'react-router-dom';
import { Download, } from 'lucide-react';
const Kyc = () => {

    return (

        <div>
            <div>
                <div className="page-content">
                    {/*breadcrumb*/}
                    <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">KYC Agreement</div>
                        <div className="ps-3">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item">
                                        <a href="javascript:;">
                                            <i className="bx bx-home-alt" />
                                        </a>
                                    </li>

                                </ol>
                            </nav>
                        </div>

                    </div>
                    <hr />
                    {/*end breadcrumb*/}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-lg-flex align-items-center mb-4 gap-3">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control ps-5 radius-10"
                                        placeholder="Search Order"
                                    />{" "}
                                    <span className="position-absolute top-50 product-show translate-middle-y">
                                        <i className="bx bx-search" />
                                    </span>
                                </div>

                            </div>
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Client Name</th>
                                            <th>Email</th>
                                            <th>Phone No.</th>
                                            <th>Aadhar No.</th>
                                            <th>Pan No.</th>
                                            <th>KYC Download</th>
                                            <th>Agreement Download</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                1
                                            </td>
                                            <td>ttggtg</td>

                                            <td>hsdd@gmail.com</td>
                                            <td>7893216540</td>
                                            <td>387 654 32101</td>
                                            <td>AEFXK5837I</td>
                                            <td >
                                                <div className='d-flex justify-content-center'>
                                                    <Download />
                                                </div>

                                            </td>

                                            <td>
                                                <div className='d-flex justify-content-center'>


                                                    <Download />
                                                </div>
                                            </td>
                                            <td>29/03/2024</td>



                                        </tr>
                                        <tr>
                                            <td>
                                                2
                                            </td>
                                            <td>rrgg</td>

                                            <td>hsdd@gmail.com</td>
                                            <td>7893216540</td>
                                            <td>387 654 32101</td>
                                            <td>AEFXK5837I</td>
                                            <td >
                                                <div className='d-flex justify-content-center'>
                                                    <Download />
                                                </div>

                                            </td>

                                            <td>
                                                <div className='d-flex justify-content-center'>


                                                    <Download />
                                                </div>
                                            </td>
                                            <td>29/03/2024</td>




                                        </tr>
                                        <tr>
                                            <td>
                                                3
                                            </td>
                                            <td>yujy</td>

                                            <td>hsdd@gmail.com</td>
                                            <td>7893216540</td>
                                            <td>387 654 32101</td>
                                            <td>AEFXK5837I</td>
                                            <td >
                                                <div className='d-flex justify-content-center'>
                                                    <Download />
                                                </div>

                                            </td>

                                            <td>
                                                <div className='d-flex justify-content-center'>


                                                    <Download />
                                                </div>
                                            </td>
                                            <td>29/03/2024</td>




                                        </tr>
                                        <tr>
                                            <td>
                                                4
                                            </td>
                                            <td>acvadv</td>

                                            <td>hsdd@gmail.com</td>
                                            <td>7893216540</td>
                                            <td>387 654 32101</td>
                                            <td>AEFXK5837I</td>
                                            <td >
                                                <div className='d-flex justify-content-center'>
                                                    <Download />
                                                </div>

                                            </td>

                                            <td>
                                                <div className='d-flex justify-content-center'>


                                                    <Download />
                                                </div>
                                            </td>
                                            <td>29/03/2024</td>




                                        </tr>
                                        <tr>
                                            <td>
                                                5
                                            </td>
                                            <td>safafs</td>

                                            <td>hsdd@gmail.com</td>
                                            <td>7893216540</td>
                                            <td>387 654 32101</td>
                                            <td>AEFXK5837I</td>
                                            <td >
                                                <div className='d-flex justify-content-center'>
                                                    <Download />
                                                </div>

                                            </td>

                                            <td>
                                                <div className='d-flex justify-content-center'>


                                                    <Download />
                                                </div>
                                            </td>
                                            <td>29/03/2024</td>




                                        </tr>
                                        <tr>
                                            <td>
                                                6
                                            </td>
                                            <td>vsdv</td>

                                            <td>hsdd@gmail.com</td>
                                            <td>7893216540</td>
                                            <td>387 654 32101</td>
                                            <td>AEFXK5837I</td>
                                            <td >
                                                <div className='d-flex justify-content-center'>
                                                    <Download />
                                                </div>

                                            </td>

                                            <td>
                                                <div className='d-flex justify-content-center'>


                                                    <Download />
                                                </div>
                                            </td>
                                            <td>29/03/2024</td>




                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Kyc;
