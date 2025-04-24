import React from 'react'
import { useNavigate } from "react-router-dom";


const ThankYou = () => {

  const navigate = useNavigate();

  const handleGoBack = () => {
    // navigate('/user/service')
    navigate('/user/subscription')
  }
  return (
    <div>
      <div className="thankyou-wrapper">
        {/* Confetti */}

        {/* Thank You Card */}
        <div className="card col-md-7">
          <div className='check-header'>
            <div className="check-container">

              <img style={{ width: '100px' }} src='/assets/images/200w.gif' />
            </div>
          </div>
          <h1>Thank You!</h1>
          <p>You have successfully subscribed<br /> the basket.</p>
          <button className="btn btn-primary mt-4 w-50 mx-auto" onClick={handleGoBack}>Go Back</button>
        </div>
      </div>

      {/* <div className="col-md-8 mx-auto mt-5">
        <div className="wrapper-1">
          <div className="wrapper-2">
            <img style={{ width: '100px' }} src='/assets/images/folding-hand.png' />
            <h1>Thank you !</h1>
            <p>You have successfully subscribed the basket.</p>

            <button className="btn btn-primary mt-4" onClick={handleGoBack}>Go Back</button>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default ThankYou