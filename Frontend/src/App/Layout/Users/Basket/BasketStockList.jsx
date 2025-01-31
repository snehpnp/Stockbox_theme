import React from 'react'
import Content from "../../../components/Contents/Content";
import ReusableModal from '../../../components/Models/ReusableModal';
import { useState } from 'react';

const BasketStockList = () => {

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
 

  return (
    <Content
    Page_title="Stock List"
    button_status={true}
    button_title={"Rebalance History"}
    route={'/user/rebalancehistory'}
    backbutton_status={false}
    backbutton_title="Back">

    <div className="row">   
    <div className="col-md-12">
        <div className='card mb-3'>
            <div className='card-body'> <ul className="list-group list-group-flush list shadow-none ">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Minimum Investment
              <span className="badge bg-dark rounded-pill">₹10</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              CAGR<span className="badge bg-success rounded-pill">null %</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center border-bottom">
              Type<span className="badge bg-danger rounded-pill">null</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Theme<span className="badge bg-warning rounded-pill">dsd</span>
            </li>
           
          </ul></div>
        </div>
   
    <div className="table-responsive">
    <table className="table ">
    <thead className='table-primary'>
    <tr>
    <th>Stock Name</th>
    <th>Qty</th>
    <th> Suggested Price </th>
    <th>Stock Weightage</th>
    <th>Current Market Price</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>Reliance</td>
    <td>2</td>
    <td>RELIANCE</td>
    <td>2000</td>
    <td>10</td>
  
    </tr>
    <tr>
    <td>Infosys</td>
    <td>1</td>
    <td>INFY</td>
    <td>1000</td>
    <td>20</td>
    </tr>
   </tbody>
    </table>
    </div>
    <button className="btn btn-success" onClick={() => setShowModal(true)}>Buy Now</button>
    </div>
    </div>
    <ReusableModal
        show={showModal}
        onClose={handleCloseModal}
        title={<>Investement Amount</>}
        body={
          <div>
            <input type="text" className="form-control" placeholder="Enter Investment Amount" />
            <p className='fs-14 mb-0 mt-1'>Minimum Investment Amount: <strong>₹ 35000</strong></p>
          </div>
        }
        footer={<> <button className="btn btn-primary">Place Order</button> 
        <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button></>}
      />
     


    </Content>
  )
}

export default BasketStockList