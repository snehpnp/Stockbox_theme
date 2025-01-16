import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { UserLoginApi } from "../../Services/Auth/Login";
import { image_baseurl } from "../../../Utils/config";
import { Link } from 'react-router-dom';




const Userlogin = () => {


    const navigate = useNavigate();






    let logoSrc =
        "https://www.pms.crmplus.in/files/system/_file5c2e1123e834d-site-logo.png";



    const [status, setStatus] = useState(1);
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);



    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = (e) => {
        e.preventDefault();
        setShowConfirmPassword(!showConfirmPassword);
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        if (email.trim() === "" || password.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please enter both email and password",
            });
            return;
        }

        setIsLoading(true);
        const ResData = await UserLoginApi({ UserName: email, password: password });
        setIsLoading(false);

        if (ResData.status) {

            localStorage.setItem("Token", ResData.data?.token);
            localStorage.setItem("Id", ResData.data?.id);
            localStorage.setItem(
                "Role",
                ResData?.data?.Role === 0
                    ? "SUPERADMIN"
                    : ResData?.data?.Role === 1
                        ? "ADMIN"
                        : ResData?.data?.Role === 2
                            ? "EMPLOYEE"
                            : "USER"
            );

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Login successful!",
                timer: 1500,
            }).then(() => {
                navigate("/user/dashboard");
                window.location.reload();
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: ResData.message,
            });
        }
    };


    return (
        <div className="main-login">
            <div className="row align-items-center h-100">
                <div className="col-lg-7 mx-auto">
                    {status === 1 ? (
                        <div className="login-wrapper">
                            <div className="background"></div>
                            <div className="login-container active">
                                <img src={logoSrc} alt="Logo" />
                                <div className="inner-div mt-4">
                                    <form className="login-form" onSubmit={handleLogin}>
                                        <div className="form-item">
                                            {/* <label htmlFor="email-login">Email</label> */}
                                            <input
                                                id="email-login"
                                                placeholder="Email"
                                                type="textemail"
                                                // aria-label="Enter your email"
                                                value={email}
                                                onChange={(e) => setemail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-item">
                                            {/* <label htmlFor="password-login">Password</label> */}
                                            <input
                                                id="password-login"
                                                placeholder="Password"
                                                type="password"
                                                aria-label="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            className="form-button"
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Logging in..." : "Login"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : status === 2 ? (
                        <div className='bg-login'>
                            <div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
                                <div className="container-fluid ">
                                    <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                                        <div className="col mx-auto">
                                            <div className="card mb-0">
                                                <div className="card-body">
                                                    <div className="p-4">
                                                        <div className="mb-5 text-center">
                                                            {/* <img style={{ width: "241px" }} src={`${image_baseurl}uploads/basicsetting/${clients[0]?.logo}`} /> */}
                                                        </div>

                                                        <div className="form-body">
                                                            <form className="row g-3" onSubmit={handleLogin} >
                                                                <div className="col-12">
                                                                    <label htmlFor="inputEmailAddress" className="form-label">
                                                                        setemail
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="inputEmailAddress"
                                                                        placeholder="Enter Your setemail"
                                                                        value={email}
                                                                        onChange={(e) => setemail(e.target.value)}
                                                                    />
                                                                </div>

                                                                <div className="col-12">
                                                                    <label htmlFor="inputChoosePassword" className="form-label">
                                                                        Password
                                                                    </label>
                                                                    <div className="input-group" id="show_hide_password">
                                                                        <input
                                                                            type={showPassword ? 'text' : 'password'}
                                                                            className="form-control border-end-0"
                                                                            id="inputChoosePassword"
                                                                            value={password}
                                                                            onChange={(e) => setPassword(e.target.value)}
                                                                            placeholder="Enter Password"
                                                                        />
                                                                        <a
                                                                            href="javascript:;"
                                                                            onClick={togglePasswordVisibility}
                                                                            className="input-group-text bg-transparent"

                                                                        >
                                                                            <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`} />
                                                                        </a>
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-6 ">

                                                                    <p className="mb-0">

                                                                        <Link to="/forget">Forgot Password?</Link>
                                                                    </p>
                                                                </div>

                                                                <div className="col-12">
                                                                    <div className="d-grid">
                                                                        <button type="submit" className="btn btn-primary">
                                                                            Sign in
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                            </form>

                                                        </div>
                                                        <div className="login-separater text-center mb-5">

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="login-wrapper">
                            <div className="background"></div>
                            <div className="login-container active">
                                <img src={logoSrc} alt="Logo" />
                                <div className="inner-div mt-4">
                                    <form className="login-form" onSubmit={handleLogin}>
                                        <div className="form-item">
                                            {/* <label htmlFor="email-login">Email</label> */}
                                            <input
                                                id="email-login"
                                                placeholder="Email"
                                                type="textemail"
                                                // aria-label="Enter your email"
                                                value={email}
                                                onChange={(e) => setemail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-item">
                                            {/* <label htmlFor="password-login">Password</label> */}
                                            <input
                                                id="password-login"
                                                placeholder="Password"
                                                type="password"
                                                aria-label="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            className="form-button"
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Logging in..." : "Login"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Userlogin;
