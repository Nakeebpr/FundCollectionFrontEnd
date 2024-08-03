import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { post } from "../services/apiServices";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const showPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Please enter the username"),
      password: Yup.string().required("Please enter the password"),
    }),

    onSubmit: async (values) => {
      const data = {
        userName: values.userName,
        password: values.password,
      };

      try {
        setIsLoading(true);
        const response = await post("/api/login", data);

        if (response?.data?.status == "Success") {
          localStorage.setItem("token", response?.data?.token);
          localStorage.setItem("role", response?.data?.Role);
          navigation("/");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

  // submit modal

  // const sendEmail = async () => {
  //   try {
  //     console.log("in sendEmail");
  //     setIsLoading(true);
  //     let response = await get("/api/forgotPassword");
  //     navigate("/forgotPassword");
  //     setIsLoading(false);
  //   } catch (error) {
  //     setIsLoading(false);
  //     // {..eat expression}
  //   }
  // };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const validationModal = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please enter email"),
    }),

    onSubmit: async (values) => {
      console.log(values, "values  in validationModal");

      const data = {
        email: values.email,
      };

      try {
        setIsLoading(true);
        const response = await post("/api/forgotPassword", data);

        if (response?.data?.status == "Success") {
          navigation("/forgotPassword");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

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
                          <lable className="form-label">User Name</lable>
                          <div style={{ position: "relative" }}>
                            <input
                              name="userName"
                              className={`${
                                validation.errors.userName &&
                                validation.touched.userName
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              placeholder="Please Enter The username"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.userName || ""}
                              invalid={
                                validation.touched.userName &&
                                validation.errors.userName
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.userName &&
                            validation.errors.userName ? (
                              <div type="invalid" style={{ color: "red" }}>
                                {validation.errors.userName}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mb-3">
                          <lable className="form-label">Password</lable>
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

                        <div className="mt-3 d-grid">
                          <button
                            className="btn btn-primary btn-block button"
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? "Logging In" : "Log In"}
                          </button>
                        </div>
                        <div className="d-flex justify-content-around row">
                          <div className="mt-4 text-center col-11 col-md-4 ">
                            <button
                              className="btn btn-primary btn-block button"
                              // onClick={sendEmail}
                              onClick={() => setOpenModal(true)}
                              type="button"
                            >
                              <i className="mdi mdi-lock me-1" />
                              Forgot Password
                            </button>
                          </div>

                          <div className="mt-4 text-center col-11 col-md-4">
                            <button
                              className="btn btn-primary btn-block button"
                              onClick={() => navigation("/register")}
                              disabled={isLoading}
                            >
                              <i className="mdi mdi-lock me-1" />
                              Go To Register
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <form
                        className="form-horizontal"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validationModal.handleSubmit();
                          return false;
                        }}
                      >
                        <Typography
                          id="modal-modal-title"
                          className="text-center"
                          variant="h6"
                          component="h2"
                        >
                          <div>Please Enter Email</div>
                          <input
                            name="email"
                            className={`${
                              validationModal.errors.email &&
                              validationModal.touched.email
                                ? "form-control lable-margin textColor errorBox"
                                : "form-control lable-margin inputFocus textColor"
                            }`}
                            placeholder="Please Enter The username"
                            type="text"
                            onChange={validationModal.handleChange}
                            onBlur={validationModal.handleBlur}
                            value={validationModal.values.email || ""}
                            invalid={
                              validationModal.touched.email &&
                              validationModal.errors.email
                                ? true
                                : false
                            }
                          />
                          {validationModal.touched.email &&
                          validationModal.errors.email ? (
                            <div type="invalid" style={{ color: "red" }}>
                              {validationModal.errors.email}
                            </div>
                          ) : null}
                        </Typography>
                        <Typography
                          id="modal-modal-description"
                          className="d-flex justify-content-around"
                          sx={{ mt: 2 }}
                        >
                          <button
                            type="submit"
                            className="btn btn-success"
                            disabled={isLoading}
                          >
                            {isLoading ? "Sending OTP" : "Send OTP"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCloseModal}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                        </Typography>
                      </form>
                    </Box>
                  </Modal>
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

export default Login;
