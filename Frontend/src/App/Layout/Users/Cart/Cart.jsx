import React from 'react'
import Content from "../../../components/Contents/Content";
import { X } from 'lucide-react';


const Cart = () => {
  return (
    <Content Page_title="Cart" button_title="Back" button_status={false}>
        
        <div>

            <table className="table cart-table    table-hover">
                <thead>
                    <tr>
                        <td scope="col" className='text-muted fs-6'>#</td>
                        <td scope="col" className='text-muted'>Image</td>
                        <td scope="col" className='text-muted'>Product</td>
                        <td scope="col" className='text-muted' style={{width:'200px'}}> Driscription</td>
                        <td scope="col" className='text-muted'>Price</td>
                        <td scope="col" className='text-muted'>Quantity</td>
                        <td scope="col" className='text-muted'>Action</td>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="row">1</td>
                        <td><img style={{width:"60px"}} src="https://stockboxpnp.pnpuniverse.com/uploads/banner/image-1744710905619-307701943.png" alt=""/></td>
                        <td>Product 1</td>
                        <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                        <td>$10.00</td>
                        <td>1</td>
                        <td className='text-danger'>
                            <X  className='text-danger'/>
                        </td>
                        </tr>
                        <tr>
                        <td scope="row">1</td>
                        <td><img  style={{width:"60px"}} src="https://stockboxpnp.pnpuniverse.com/uploads/banner/image-1744710905619-307701943.png" alt=""/></td>
                        <td>Product 1</td>
                        <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                        <td>$10.00</td>
                        <td>1</td>
                      
                        <td className='text-danger'>
                            <X  className='text-danger'/>
                        </td>
                        </tr>
                        <tr>
                        <td scope="row">1</td>
                        <td><img style={{width:"60px"}} src="https://stockboxpnp.pnpuniverse.com/uploads/banner/image-1744710905619-307701943.png" alt=""/></td>
                        <td>Product 1</td>
                        <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                        <td>$10.00</td>
                        <td>1</td>
                        <td className='text-danger'>
                            <X  className='text-danger'/>
                        </td>
                        </tr>
                </tbody>
                </table>
        </div>
        <div className='row'>
            <div className='col-md-6 offset-md-6'>
                <div className='card shadow-lg'>
                    <div className='card-body'>
                        <h5 className=''>Cart Summary</h5>
                        <hr/>
                        <h6 className='mb-3'>Total :$30.00</h6>
                        <h6 className='mb-3'>Grand Total: $30.00</h6>
                        <button className='btn btn-primary w-100'>Checkout</button>
                      
                    </div>
                </div>
                </div>
        </div>
        </Content>
    
  )
}

export default Cart