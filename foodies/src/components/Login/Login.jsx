import React from 'react';
import './Login.css';
import {Link} from "react-router-dom";

const Login = () => {
    return (
        <div className=" login-container py-5">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    {/* ✨ BOX NGOÀI: Bọc bóng đổ mềm mại, bo góc tròn 3 và bỏ viền thô */}
                    <div className="card border-0 shadow rounded-3 my-2">
                        <div className="card-body p-4 p-sm-5">
                            <h5 className="card-title text-center mb-5 fw-light fs-5 text-uppercase tracking-wide text-secondary">
                                Sign In
                            </h5>
                            <form>
                                {/* ✉️ Email Address Field */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="email"
                                        className="form-control rounded-2"
                                        id="floatingInput"
                                        placeholder="name@example.com"
                                    />
                                    <label htmlFor="floatingInput" className="text-muted">Email address</label>
                                </div>

                                {/* 🔑 Password Field */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control rounded-2"
                                        id="floatingPassword"
                                        placeholder="Password"
                                    />
                                    <label htmlFor="floatingPassword" className="text-muted">Password</label>
                                </div>

                                {/* 🔲 Remember Password Checkbox */}
                                <div className="form-check mb-3 d-flex align-items-center gap-2">
                                    <input
                                        className="form-check-input mt-0"
                                        type="checkbox"
                                        value=""
                                        id="rememberPasswordCheck"
                                    />
                                    <label className="form-check-label small text-secondary user-select-none" htmlFor="rememberPasswordCheck">
                                        Remember password
                                    </label>
                                </div>


                                {/* 🚀 Primary Sign In Button */}
                                <div className="d-grid mb-3">
                                    <button
                                        className="btn btn-primary btn-login text-uppercase fw-bold py-2.5 rounded-pill shadow-sm"
                                        type="submit"
                                        style={{ letterSpacing: "1px", backgroundColor: "#99D9F2", border: "none" }}
                                    >
                                        Sign in
                                    </button>

                                    <button
                                        className="btn btn-danger btn-login text-uppercase fw-bold py-2.5 rounded-pill shadow-sm mt-2"
                                        type="reset"
                                        style={{ letterSpacing: "1px", backgroundColor: "#80ED99", border: "none" }}
                                    >
                                        Reset
                                    </button>

                                </div>

                                <div className="small text-secondary mb-3 d-flex gap-2 ">
                                    Doesn't have an account? <Link to="/register"> Sign up</Link>
                                </div>

                                <hr className="my-4 text-muted opacity-25" />

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;