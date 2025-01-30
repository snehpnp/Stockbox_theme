import React, { useEffect, useState } from 'react';
import Content from "../../../components/Contents/Content";
import Swal from 'sweetalert2';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const News = () => {



    return (
        <div>
        <Content
          Page_title="News"
          button_status={false}
          backbutton_title="Back"
          backbutton_status={false}
        >
          <div className="page-content">
         <div className='row'>
          <div className='col-md-4'>
            <div className='card'>
              <div className='card-img'>
                <img src='https://stockboxpnp.pnpuniverse.com/uploads/news/image-1736745027111-438243699.jpg' alt='news'   style={{borderTopLeftRadius: '5px', borderTopRightRadius: '5px'}} className='img-fluid'/>
              </div>
              <div className='card-header'>
                <b>In case of Option Contracts "Traded Value" represents "Premium Turnover"</b>
              </div>
              <div className='card-body'>
                <ul className='ps-2 fs-6'>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                 
                </ul>
              </div>
              <div className='card-footer'> <Link to='/user/newsdetail' className='btn btn-primary w-100'>Read More</Link> </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='card'>
              <div className='card-img'>
                <img src='https://stockboxpnp.pnpuniverse.com/uploads/news/image-1736745027111-438243699.jpg' alt='news'   style={{borderTopLeftRadius: '5px', borderTopRightRadius: '5px'}} className='img-fluid'/>
              </div>
              <div className='card-header'><b>In case of Option Contracts "Traded Value" represents "Premium Turnover"
              </b></div>
              <div className='card-body'>
                <ul className='ps-2'>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                 
                </ul>
              </div>
              <div className='card-footer'> <Link to='/user/newsdetail' className='btn btn-primary w-100'>Read More</Link> </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='card'>
              <div className='card-img'>
                <img src='https://stockboxpnp.pnpuniverse.com/uploads/news/image-1736745027111-438243699.jpg' alt='news'   style={{borderTopLeftRadius: '5px', borderTopRightRadius: '5px'}} className='img-fluid'/>
              </div>
              <div className='card-header'><b>In case of Option Contracts "Traded Value" represents "Premium Turnover"
              </b> </div>
              <div className='card-body'>
                <ul className='ps-2'>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  <li className='fs-14'>In case of Option Contracts "Traded Value" represents "Premium Turnover"</li>
                  
                </ul>
              </div>
              <div className='card-footer'> <Link to='/user/newsdetail'  className='btn btn-primary w-100'>Read More</Link> </div>
            </div>
          </div>
         </div>
          </div>
        </Content>
      </div>
    );
};

export default News;
