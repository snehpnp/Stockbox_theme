import React from 'react'
import Content from "../../../components/Contents/Content";


const RebalanceStock = () => {
    return (
        <Content
        Page_title="Rebalance stock"
        button_title="Add Basket"
        backbutton_title="back"
        button_status={false}
        backbutton_status={false}
  
      >
      <div className="card">
      <div className="card-body">
        <div className="tab-content" id="pills-tabContent">
          <div className="tab-pane fade" id="primary-pills-home" role="tabpanel">
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control w-50"
                readOnly=""
                defaultValue=""
              />
              <button className="btn btn-outline-secondary ms-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-copy"
                >
                  <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <button className="btn btn-outline-secondary ms-2">
                <i className="bx bx-share-alt" />
              </button>
            </div>
          </div>
          <div
            className="tab-pane fade active show"
            id="primary-pills-profile"
            role="tabpanel"
          >
            <div className="table-responsive">
              <table className="table mb-0">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Earning Amt.</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody />
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
            Rebalance stock
        </Content>
    )
}

export default RebalanceStock
