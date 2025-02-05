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
      backForword={true}

    >
      <div className="card">
        <div className="card-body">
          <div className='float-end mb-3'>
            <button className='btn btn-primary'>View</button>
            <button className='btn btn-danger ms-2'>Sell</button>
          </div>
          <div
            className=""

          >
            <div className="table-responsive">
              <table className="table mb-0">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">CMP</th>
                    <th scope="col">Weightage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Reliance</td>
                    <td>2000</td>
                    <td>2100</td>
                    <td>20%</td>
                  </tr>
                  <tr>
                    <td>Reliance</td>
                    <td>2000</td>
                    <td>2100</td>
                    <td>20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <div className='float-end mb-3'>
            <button className='btn btn-primary'>View</button>
            <button className='btn btn-success ms-2'>Buy</button>
          </div>
          <div
            className=""

          >
            <div className="table-responsive">
              <table className="table mb-0">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">CMP</th>
                    <th scope="col">Weightage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Reliance</td>
                    <td>2000</td>
                    <td>2100</td>
                    <td>20%</td>
                  </tr>
                  <tr>
                    <td>Reliance</td>
                    <td>2000</td>
                    <td>2100</td>
                    <td>20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </Content>
  )
}

export default RebalanceStock
