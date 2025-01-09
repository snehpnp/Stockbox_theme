import React, { useState } from 'react';
import Contnet from '../Content';

function ClassicForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (

    <Contnet Page_title="Classic Form">
      <div>
        <form onSubmit={handleSubmit}>
          <div className='row'>
            <div className='col-md-6'>
              <input type="text" name="username" placeholder="User Name *" onChange={handleChange} style={inputStyle} />
            </div>
            <div className='col-md-6'>
              <input type="text" name="fullfame" placeholder="Full Name *" onChange={handleChange} style={inputStyle} />
            </div>
            <div className='col-md-6'>
              <input type="email" name="email" placeholder="Email *" onChange={handleChange} style={inputStyle} />
            </div>
            <div className='col-md-6'>
              <input type="number" name="mobile" placeholder="Mobile *" onChange={handleChange} style={inputStyle} />
            </div>
            <div className='col-md-6'>
              <select name="licence" onChange={handleChange} style={inputStyle}>
                <option value="">Please Select Licence</option>
                <option value="0">2 Days</option>
                <option value="1">Demo</option>
                <option value="2">Live</option>
              </select>
            </div>
            <div className='col-md-6'>
              <select name="broker" onChange={handleChange} style={inputStyle}>
                <option value="">Please Select Broker</option>
                <option value="2">Alice Blue</option>
                <option value="5">Zebull</option>
                <option value="15">Zerodha </option>
                <option value="14">5 Paisa</option>
                <option value="1">Market Hub </option>
                <option value="12">Angel</option>
                <option value="3">Master Trust</option>
                <option value="13">Fyers </option>
                <option value="8">Mandot</option>
                <option value="4">Motilal Oswal</option>
                <option value="7">Kotak Neo</option>
                <option value="19">Upstox</option>
                <option value="20">Dhan</option>
                <option value="21">Swastika</option>
                <option value="25">icicidirect</option>
                <option value="26">Iifl</option>
                <option value="27">shoonya</option>
                <option value="28">choice</option>
              </select>
            </div>
            <div className='col-md-6'>
              <select name="parent_id" onChange={handleChange} style={inputStyle}>
                <option value="">Please Select Sub-Admin</option>
                <option value="6661abbaa50d35911674747e">ChandraPr7777</option>
                <option value="666fe51aa9856a08ab03347a">SG8888</option>
                <option value="66864b7f79916530293cbd2f">new sub8795</option>
                <option value="674413900fcc7f1bc3729447">Shubh Jaiswal7777</option>
                <option value="676a8db9a16b95bcc027a785">NewTest2136</option>
              </select>
            </div>
            <div className='col-md-6'>
              <select name="groupservice" onChange={handleChange} style={inputStyle}>
                <option value="">Please Select Group Service</option>
                <option value="653367df827128bcdfae41c8">TEST_1</option>
                <option value="653c98e256def7f798d72c90">test_2</option>
                <option value="655860263e7ec38d39d8e842">ukjj</option>
                <option value="666c2c416d9429e2972bf87e">ABC</option>
                <option value="66e41e411786485f89d91d9a">testdemo</option>
                <option value="66e554df4144acb292fcdce6">TEST_1s</option>
                <option value="67010b1d66c2ff1b6de8e6f5">SSWAS</option>
                <option value="673ad23a8b0f7a0c8d33571b">fff</option>
              </select>
            </div>
            <div className='col-md-12'>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <input type="checkbox" name="multiple_strategy_select" onChange={handleChange} /> Mutiple Selection Strategy
              </label>
            </div>
            <div className='col-md-12'>
              <h2 style={{fontSize: '18px', color: '#000', fontWeight: '600'}}>All Strategy</h2>
            </div>
            <div className='col-md-3'>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <input type="checkbox" onChange={handleChange} /> jhgsa
              </label>
            </div>
            <div className='col-md-3'>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <input type="checkbox" onChange={handleChange} /> jhgsa
              </label>
            </div>
            <div className='col-md-3'>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <input type="checkbox" onChange={handleChange} /> jhgsa
              </label>
            </div>
            <div className='col-md-3'>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <input type="checkbox" onChange={handleChange} /> jhgsa
              </label>
            </div>
            <div className='col-md-3'>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                <input type="checkbox" onChange={handleChange} /> jhgsa
              </label>
            </div>
            <div className='col-md-12'>
              <button type="submit" style={buttonStyle}>Submit</button>
            </div>
          </div>
        </form>
      </div>
    </Contnet>
  );
}

const inputStyle = {
  width: '100%',
  marginBottom: '10px',
  padding: '12px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px',
  background: '#4caf50',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default ClassicForm;
