import React from 'react'

const Registration = () => {
  return (
    <div className="main-login" style={{ backgroundImage: `url(${BgImg})` }}>
  <div className="row align-items-center h-100">
    <div className="col-lg-12 mx-auto">
      <div className="bg-login">
        <div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
          <div className="container-fluid ">
            <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
              <div className="col mx-auto">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="p-4">
                      <div className="mb-5 text-center">
                        <img
                          src="https://stockboxpnp.pnpuniverse.com/uploads/basicsetting/logo-1735629852084-427650703.png"
                          style={{ width: 241 }}
                        />
                      </div>
                      <div className="form-body">
                        <form className="row g-3">
                        <div className="col-12">
                            <label
                              htmlFor="inputEmailAddress"
                              className="form-label"
                            >
                              UserName
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="inputEmailAddress"
                              placeholder="Enter Your UserName"
                              defaultValue=""
                            />
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor="inputEmailAddress"
                              className="form-label"
                            >
                              Email / Mobile
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="inputEmailAddress"
                              placeholder="Enter Your Email"
                              defaultValue=""
                            />
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor="inputChoosePassword"
                              className="form-label"
                            >
                              Password
                            </label>
                            <div
                              className="input-group"
                              id="show_hide_password"
                            >
                              <input
                                type="password"
                                className="form-control border-end-0"
                                id="inputChoosePassword"
                                placeholder="Enter Password"
                                defaultValue=""
                              />
                              <a
                                href="javascript:;"
                                className="input-group-text bg-transparent"
                              >
                                <i className="bx bx-hide" />
                              </a>
                            </div>
                          </div>
                          <div className="col-md-6 ">
                            <p className="mb-0">
                              <a href="#/forget" data-discover="true">
                                Login
                              </a>
                            </p>
                          </div>
                          <div className="col-12">
                            <div className="d-grid">
                              <button type="submit" className="btn btn-primary">
                                Sign Up
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="login-separater text-center mb-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

export default Registration