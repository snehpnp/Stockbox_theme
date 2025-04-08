import React from 'react'
import { useNavigate } from "react-router-dom";


const ThankYou = () => {

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/user/service')
  }
  return (
    <div>
      <div className="col-md-8 mx-auto mt-5">
        <div className="wrapper-1">
          <div className="wrapper-2">
            <img style={{ width: '100px' }} src='/assets/images/folding-hand.png' />
            <h1>Thank you !</h1>
            <p>You have successfully subscribed the basket.</p>

            <button className="btn btn-primary mt-4" onClick={handleGoBack}>Go Back</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYou