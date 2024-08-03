import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { post } from "../services/apiServices";

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();
  //   //   const location = useLocation();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const showPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [cpasswordVisible, setCPasswordVisible] = useState(false);
  const showCPassword = () => {
    console.log("cpassword");
    setCPasswordVisible(!cpasswordVisible);
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      password: "",
      cpassword: "",
      otp: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Please Enter Password"),
      otp: Yup.string()
        .required("Please Enter OTP")
        .min(4, "OTP is of 4 digits")
        .max(4, "OTP is of 4 digits"),
      cpassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords Must Match")
        .required("Confirm Password Is Required"),
    }),

    onSubmit: async (values) => {
      // localStorage.setItem("token", "123");
      // navigation("/");

      const data = {
        password: values.password,
        cpassword: values.cpassword,
        otp: values.otp,
      };

      try {
        setIsLoading(true);
        const response = await post("/api/resetPassword", data);

        if (response?.data?.status == "Success") {
          navigation("/login");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (!/^\d*$/.test(inputValue)) {
      // If the input value contains any non-digit character, prevent it
      e.target.value = inputValue.replace(/[^\d]/g, "");
    }
  };

  return (
    <div>
      <div
        className="account-pages login-page "
        style={{ backgroundColor: "gainsboro" }}
      >
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-12 col-md-8 col-sm-8">
              <div className="overflow-hidden card login-shadow">
                <div>
                  <div className="bg-primary bg-soft">
                    <div className="row d-flex">
                      <div className="col-12 col-md-6">
                        <div className="text-primary p-4">
                          <h3 className="text-primary">
                            Welcome To Fund Collection
                          </h3>
                        </div>
                      </div>
                      <div className="col-6 align_image_center">
                        <img
                          src="/assets/images/profile-img.png"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="pt-0"
                    style={{ padding: "0px 30px", backgroundColor: "white" }}
                  >
                    <div className="form-info">
                      <form
                        className="form-horizontal"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="mb-3">
                          <lable className="form-label">Enter Password</lable>
                          <div style={{ position: "relative" }}>
                            <input
                              name="password"
                              className={`${
                                validation.errors.password &&
                                validation.touched.password
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              type={passwordVisible ? "text" : "password"}
                              placeholder="Please Enter The Password"
                              value={validation.values.password || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            <div className="eye-icon" onClick={showPassword}>
                              {passwordVisible ? (
                                <VisibilityOffIcon />
                              ) : (
                                <RemoveRedEyeIcon />
                              )}
                            </div>
                          </div>
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <div type="invalid" style={{ color: "red" }}>
                              {validation.errors.password}
                            </div>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <lable className="form-label">Confirm Password</lable>
                          <div style={{ position: "relative" }}>
                            <input
                              name="cpassword"
                              className={`${
                                validation.errors.cpassword &&
                                validation.touched.cpassword
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              type={cpasswordVisible ? "text" : "password"}
                              placeholder="Please Enter The Password"
                              value={validation.values.cpassword || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.cpassword &&
                                validation.errors.cpassword
                                  ? true
                                  : false
                              }
                            />
                            <div className="eye-icon" onClick={showCPassword}>
                              {cpasswordVisible ? (
                                <VisibilityOffIcon />
                              ) : (
                                <RemoveRedEyeIcon />
                              )}
                            </div>
                          </div>
                          {validation.touched.cpassword &&
                          validation.errors.cpassword ? (
                            <div type="invalid" style={{ color: "red" }}>
                              {validation.errors.cpassword}
                            </div>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <lable className="form-label">Enter OTP</lable>
                          <div style={{ position: "relative" }}>
                            <input
                              name="otp"
                              className={`${
                                validation.errors.otp && validation.touched.otp
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              type="text"
                              placeholder="Please Enter The OTP"
                              value={validation.values.otp || ""}
                              onInput={handleInputChange}
                              maxLength={4}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.otp && validation.errors.otp
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          {validation.touched.otp && validation.errors.otp ? (
                            <div type="invalid" style={{ color: "red" }}>
                              {validation.errors.otp}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-3 d-grid">
                          <button
                            className="btn btn-primary btn-block button"
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading
                              ? "Changing Password"
                              : "Change Password"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} Crafted With{" "}
                  <FavoriteIcon sx={{ color: "red" }} /> by Webosorous
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
