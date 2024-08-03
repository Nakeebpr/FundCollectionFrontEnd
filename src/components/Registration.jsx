import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { post } from "../services/apiServices";

function Registration() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();
  const location = useLocation();

  const navigate = useNavigate();

  const { state } = location;

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (!/^\d*$/.test(inputValue)) {
      // If the input value contains any non-digit character, prevent it
      e.target.value = inputValue.replace(/[^\d]/g, "");
    }
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      firstName: state ? state?.data?.firstName : "",
      middleName: state ? state?.data?.middleName : "",
      lastName: state ? state?.data?.lastName : "",
      phoneNo: state ? state?.data?.mobileNo : "",
      email: state ? state?.data?.email : "",
      joiningDate: state ? state?.data?.joiningDate : "",
      address: state ? state?.data?.address : "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please enter the First Name"),
      middleName: Yup.string(),
      lastName: Yup.string().required("Please enter the Last Name"),
      phoneNo: Yup.string()
        .min(10, "Enter correct phone Number")
        .max(10, "Enter correct Phone Number")
        .matches(/^[0-9]+$/, "Enter correct Phone Number")
        .required("Please enter the Phone Number"),
      address: Yup.string().required("Please enter the address"),
      joiningDate: Yup.string().required("Please add the Joining Date"),
      email: Yup.string().email("Please enter valid email"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);
        let data = {
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          email: values.email,
          joiningDate: values.joiningDate,
          mobileNo: values.phoneNo,
          address: values.address,
        };
        const response = await post("/api/register", data);

        if (response?.data?.status == "Success") {
          navigation("/customerList");
        }

        setIsLoading(false);
        resetForm();
      } catch (error) {
        console.log("error", error);
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="app-container">
      <Header />
      <div
        className="account-pages login-page content"
        style={{ backgroundColor: "gainsboro" }}
      >
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-12 col-md-8 col-sm-8">
              <div className="overflow-hidden card login-shadow">
                <div>
                  <div className="bg-primary bg-soft">
                    <div className="row d-flex">
                      <div className="col-12">
                        <div className="text-primary p-4">
                          <h3 className="text-primary">
                            Welcome To Fund Collection Registration
                          </h3>
                          {state && (
                            <div>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => navigate(state && state.from)}
                              >
                                Return to customer list
                              </button>
                            </div>
                          )}
                        </div>
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
                          <lable className="form-label">
                            First Name<span style={{ color: "red" }}>*</span>
                          </lable>
                          <div style={{ position: "relative" }}>
                            <input
                              name="firstName"
                              className={`${
                                validation.errors.firstName &&
                                validation.touched.firstName
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              placeholder="Please Enter The firstName"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.firstName || ""}
                              invalid={
                                validation.touched.firstName &&
                                validation.errors.firstName
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.firstName &&
                            validation.errors.firstName ? (
                              <div type="invalid" style={{ color: "red" }}>
                                {validation.errors.firstName}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-3">
                          <lable className="form-label">Middle Name</lable>
                          <div style={{ position: "relative" }}>
                            <input
                              name="middleName"
                              className={`${
                                validation.errors.middleName &&
                                validation.touched.middleName
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              placeholder="Please Enter The middleName"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.middleName || ""}
                              invalid={
                                validation.touched.middleName &&
                                validation.errors.middleName
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.middleName &&
                            validation.errors.middleName ? (
                              <div type="invalid" style={{ color: "red" }}>
                                {validation.errors.middleName}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-3">
                          <lable className="form-label">
                            Last Name<span style={{ color: "red" }}>*</span>
                          </lable>
                          <div style={{ position: "relative" }}>
                            <input
                              name="lastName"
                              className={`${
                                validation.errors.lastName &&
                                validation.touched.lastName
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              placeholder="Please Enter The lastName"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.lastName || ""}
                              invalid={
                                validation.touched.lastName &&
                                validation.errors.lastName
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.lastName &&
                            validation.errors.lastName ? (
                              <div type="invalid" style={{ color: "red" }}>
                                {validation.errors.lastName}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-3">
                          <lable className="form-label">
                            Mobile Number<span style={{ color: "red" }}>*</span>
                          </lable>
                          <div style={{ position: "relative" }}>
                            <input
                              name="phoneNo"
                              className={`${
                                validation.errors.phoneNo &&
                                validation.touched.phoneNo
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              placeholder="Please Enter The phoneNo"
                              type="tel"
                              onInput={handleInputChange}
                              maxLength={10}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.phoneNo || ""}
                              invalid={
                                validation.touched.phoneNo &&
                                validation.errors.phoneNo
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.phoneNo &&
                            validation.errors.phoneNo ? (
                              <div type="invalid" style={{ color: "red" }}>
                                {validation.errors.phoneNo}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-3">
                          <lable className="form-label">Email</lable>
                          <div style={{ position: "relative" }}>
                            <input
                              name="email"
                              className={`${
                                validation.errors.email &&
                                validation.touched.email
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              placeholder="Please Enter The email"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email || ""}
                              invalid={
                                validation.touched.email &&
                                validation.errors.email
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.email &&
                            validation.errors.email ? (
                              <div type="invalid" style={{ color: "red" }}>
                                {validation.errors.email}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-3">
                          <lable className="form-label">Joining Date</lable>
                          <input
                            type="date"
                            name="joiningDate"
                            id="joiningDate"
                            placeholder="Please Enter Date of Joinging"
                            className={`${
                              validation.errors.joiningDate &&
                              validation.touched.joiningDate
                                ? "form-control lable-margin textColor errorBox"
                                : "form-control lable-margin inputFocus textColor"
                            }`}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.joiningDate || ""}
                            invalid={
                              validation.touched.joiningDate &&
                              validation.errors.joiningDate
                                ? true
                                : false
                            }
                          />
                          {validation.touched.joiningDate &&
                          validation.errors.joiningDate ? (
                            <div type="invalid" style={{ color: "red" }}>
                              {validation.errors.joiningDate}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <lable className="form-label">
                            Address<span style={{ color: "red" }}>*</span>
                          </lable>
                          <div style={{ position: "relative" }}>
                            <textarea
                              rows="3"
                              cols="50"
                              name="address"
                              className={`${
                                validation.errors.address &&
                                validation.touched.address
                                  ? "form-control lable-margin textColor errorBox"
                                  : "form-control lable-margin inputFocus textColor"
                              }`}
                              placeholder="Please Enter The address"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.address || ""}
                              invalid={
                                validation.touched.address &&
                                validation.errors.address
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.address &&
                            validation.errors.address ? (
                              <div type="invalid" style={{ color: "red" }}>
                                {validation.errors.address}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-3 d-grid">
                          <button
                            className="btn btn-success btn-block button"
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? "Registering..." : "Register"}
                          </button>
                        </div>
                        <div className="d-flex justify-content-center pt-3">
                          <button
                            className="btn btn-danger btn-block button"
                            style={{ width: "250px" }}
                            onClick={() => navigation("/")}
                          >
                            Return To Home
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Registration;
