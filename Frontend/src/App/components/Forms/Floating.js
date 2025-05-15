import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Contnet from '../Contents/Content';

function FloatingForm() {
  return (

    <Contnet Page_title="Floating Label ">
      <div>
        <Form>
          <div className='row'>
            <div className='col-md-6'>
              <Form.Floating>
                <Form.Control
                  type="text"
                  placeholder="User Name"
                  id="username"
                />
                <label htmlFor="username">User Name</label>
              </Form.Floating>
            </div>
            <div className='col-md-6'>
              <Form.Floating>
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  id="fullname"
                />
                <label htmlFor="fullname">Full Name</label>
              </Form.Floating>
            </div>
            <div className='col-md-6'>
              <Form.Floating>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  id="email"
                />
                <label htmlFor="email">Email</label>
              </Form.Floating>
            </div>
            <div className='col-md-6'>
              <Form.Floating >
                <Form.Control
                  type="number"
                  placeholder="Mobile"
                  id="mobile"
                />
                <label htmlFor="mobile">Mobile</label>
              </Form.Floating>
            </div>
            <div className='col-md-6'>
              <Form.Floating >
                <Form.Select id="licence">
                  <option value="">Please Select Licence</option>
                  <option value="0">2 Days</option>
                  <option value="1">Demo</option>
                  <option value="2">Live</option>
                </Form.Select>
                <label htmlFor="licence">Licence</label>
              </Form.Floating>
            </div>
            <div className='col-md-6'>
              <Form.Floating >
                <Form.Select id="broker">
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
                </Form.Select>
                <label htmlFor="broker">Broker</label>
              </Form.Floating>
            </div>
            <div className='col-md-6'>
              <Form.Floating >
                <Form.Select id="parent_id">
                  <option value="">Please Select Sub-Admin</option>
                  <option value="6661abbaa50d35911674747e">ChandraPr7777</option>
                  <option value="666fe51aa9856a08ab03347a">SG8888</option>
                  <option value="66864b7f79916530293cbd2f">new sub8795</option>
                  <option value="674413900fcc7f1bc3729447">Shubh Jaiswal7777</option>
                  <option value="676a8db9a16b95bcc027a785">NewTest2136</option>
                </Form.Select>
                <label htmlFor="parent_id">Sub-Admin</label>
              </Form.Floating>
            </div>
            <div className='col-md-6'>
              <Form.Floating >
                <Form.Select id="groupservice">
                  <option value="">Please Select Group Service</option>
                  <option value="653367df827128bcdfae41c8">TEST_1</option>
                  <option value="653c98e256def7f798d72c90">test_2</option>
                  <option value="655860263e7ec38d39d8e842">ukjj</option>
                  <option value="666c2c416d9429e2972bf87e">ABC</option>
                  <option value="66e41e411786485f89d91d9a">testdemo</option>
                  <option value="66e554df4144acb292fcdce6">TEST_1s</option>
                  <option value="67010b1d66c2ff1b6de8e6f5">SSWAS</option>
                  <option value="673ad23a8b0f7a0c8d33571b">fff</option>
                </Form.Select>
                <label htmlFor="groupservice">Group Service</label>
              </Form.Floating>
            </div>
            <div className='col-md-12'>
              <Form.Group >
                <Form.Check
                  type="checkbox"
                  id="floatingCheckbox"
                  label="I agree to the terms and conditions"
                />
              </Form.Group>
            </div>
            <div className='col-md-12'>
              <h2 style={{fontSize: '18px', color: '#000', fontWeight: '600'}}>All Strategy</h2>
            </div>
            <div className='col-md-3'>
              <Form.Group >
                <Form.Check
                  type="checkbox"
                  id="jhgsa"
                  label="jhgsa"
                />
              </Form.Group>
            </div>
            <div className='col-md-3'>
              <Form.Group >
                <Form.Check
                  type="checkbox"
                  id="jhgsa1"
                  label="jhgsa1"
                />
              </Form.Group>
            </div>
            <div className='col-md-3'>
              <Form.Group >
                <Form.Check
                  type="checkbox"
                  id="jhgsa2"
                  label="jhgsa2"
                />
              </Form.Group>
            </div>
            <div className='col-md-3'>
              <Form.Group >
                <Form.Check
                  type="checkbox"
                  id="jhgsa3"
                  label="jhgsa3"
                />
              </Form.Group>
            </div>
            <div className='col-md-3'>
              <Form.Group >
                <Form.Check
                  type="checkbox"
                  id="jhgsa4"
                  label="jhgsa4"
                />
              </Form.Group>
            </div>
            <div className='col-md-12'>
              <Button variant="primary" type="submit">
                Submit
            </Button>
            </div>
          </div>
        </Form>
      </div>        
    </Contnet>
  );
}

export default FloatingForm;
