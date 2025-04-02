import React from 'react'

const ViewWithdrawal = () => {
    return (
        <div>
            <div className="page-content">
                <div className="page-breadcrumb  d-flex align-items-center mb-3">
                    <div className="breadcrumb-title pe-3">All  Withdrawal</div>
                    <div className="ps-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 p-0">
                                <li className="breadcrumb-item">
                                    <a href="/admin/dashboard">
                                        <i className="bx bx-home-alt" />
                                    </a>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <hr />

                <div className="row align-items-center ">
                    <div className="col-md-12">
                        <div className="card">

                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">
                                    Some quick example text to build on the card title and make up the bulk
                                    of the card's content.
                                </p>
                            </div>
                            <table className="table mb-0">
                                <thead className="table-primary">
                                    <tr>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Request Date</th>
                                        <th scope="col">Update Date</th>
                                        <th scope="col">Remark</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">Hask</th>
                                        <td>20</td>
                                        <td>True</td>
                                        <td>20/10/2024</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViewWithdrawal
