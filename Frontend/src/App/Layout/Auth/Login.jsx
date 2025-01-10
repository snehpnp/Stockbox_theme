import React, { useState, useEffect } from 'react';

const Login = () => {
  const [status, setStatus] = useState(null); // Default status is null

  useEffect(() => {
    // Retrieve the status from localStorage
    const userData = JSON.parse(localStorage.getItem('user_data')); // Adjust key as per your storage
    if (userData && userData.status) {
      setStatus(userData.status);
    }
  }, []);

  return (
    <>  
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {status === "1" ? (
            // First Login Form
            <div className="login-wrapper">
              <div className="background" />
              <div className="login-container active">
                <div className="inner-div">
                  <h2 className="headline">Login</h2>
                  <form className="login-form">
                    <div className="form-item">
                      <label htmlFor="username-login">Username</label>
                      <input
                        id="username-login"
                        name="username"
                        type="text"
                        required=""
                      />
                    </div>
                    <div className="form-item">
                      <label htmlFor="password-login">Password</label>
                      <input
                        id="password-login"
                        name="password"
                        type="password"
                        required=""
                      />
                    </div>
                    <button className="form-button">Login</button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            // Second Login Form
            <div className="glass-container">
              <div className="wrapper">
                <h1>Login</h1>
                <form>
                  <div>
                    <label htmlFor="email-input">
                      <span>@</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email-input"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password-input">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height={24}
                        viewBox="0 -960 960 960"
                        width={24}
                      >
                        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                      </svg>
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password-input"
                      placeholder="Password"
                    />
                  </div>
                  <button type="submit">Login</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
