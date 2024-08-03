import React, { useRef, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { post } from "../services/apiServices";
import moment from "moment";

function CustomerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const customerData = location?.state?.data;

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // upload image start
  const fileInputRef = useRef(null);
  const [imagePath, setImagePath] = useState("");
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const uploadImage = async (e) => {
    try {
      const formData = new FormData();
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      formData.append("image", e.target.files[0]);
      setIsLoadingImage(true);
      const response = await post(`/api/uploadImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImagePath(response?.data?.path);
      setIsLoadingImage(false);
    } catch (error) {
      setIsLoadingImage(false);
    }
  };
  // upload image end

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      firstName: customerData?.firstName ? customerData?.firstName : "",
      middleName: customerData?.middleName ? customerData?.middleName : "",
      lastName: customerData?.lastName ? customerData?.lastName : "",
      phoneNo: customerData?.mobileNo ? customerData?.mobileNo : "",
      address: customerData.address ? customerData?.address : "",
      email: customerData?.email ? customerData?.email : "",
      date: customerData?.joiningDate ? customerData?.joiningDate : "",
      passbookId: customerData?.passbookId ? customerData?.passbookId : "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter First Name"),
      middleName: Yup.string().required("Please Enter Middle Name"),
      lastName: Yup.string().required("Please Enter Last Name"),
      phoneNo: Yup.string()
        .min(10, "Enter Correct Phone Number")
        .max(10, "Enter Correct Phone Number")
        .matches(/^[0-9]+$/, "Enter Correct Phone Number")
        .required("Please Enter The Phone Number"),
      address: Yup.string().required("Please Enter The Address"),
      email: Yup.string().email("Please Enter Valid Email"),
    }),

    onSubmit: async (values) => {
      values.profilePicPath = imagePath;

      try {
        const data = {
          id: customerData?._id,
          firstName: values?.firstName,
          middleName: values?.middleName,
          lastName: values?.lastName,
          mobileNo: values?.phoneNo,
          address: values?.address,
          email: values?.email,
          profilePicPath: imagePath,
        };

        try {
          setIsLoading(true);
          const response = await post("/api/updateCustomer", data);

          if (response?.data?.status == "Success") {
            navigate("/customerList");
            setIsLoading(false);
            setImageUrl("");
          }
        } catch (error) {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

  console.log(imageUrl, "imageUrl");
  console.log(customerData, "customerData");

  return (
    <div className="app-container">
      <Header />
      <div className="content" style={{ backgroundColor: "gainsboro" }}>
        <div className="container-fluid">
          <div className="justify-content-center row">
            <div className="col-12 col-md-12 col-sm-12">
              <div className="overflow-hidden card login-shadow">
                <div>
                  <div
                    className="pt-0"
                    style={{ padding: "0px 30px", backgroundColor: "white" }}
                  >
                    <form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <Box>
                        <Grid container>
                          <Grid item xs={12} md={3}>
                            <div className="customerImage">
                              <img
                                src={
                                  imageUrl
                                    ? imageUrl
                                    : customerData.profilePicPath
                                    ? customerData.profilePicPath
                                    : "https://static.vecteezy.com/system/resources/previews/024/766/962/non_2x/silver-gradient-social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-free-vector.jpg"
                                }
                                alt=""
                                width="150px"
                                height="150px"
                                className="my-3"
                                style={{
                                  border: "1px solid black",
                                  borderRadius: "5px",
                                }}
                              />
                              {isUpdateOpen && (
                                <div
                                  className="d-flex "
                                  style={{
                                    width: "300px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <input
                                    name="image"
                                    className="form-control lable-margin referral-input1 inputFocus"
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={uploadImage}
                                    disabled={isLoadingImage}
                                  />
                                </div>
                              )}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={9}>
                            <Box>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                  <div>
                                    <div>
                                      FirstName
                                      <span style={{ color: "red" }}>*</span> :
                                    </div>
                                    <TextField
                                      id="firstName"
                                      name="firstName"
                                      disabled={!isUpdateOpen}
                                      multiline
                                      maxRows={4}
                                      variant="filled"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.firstName || ""}
                                      sx={{ display: "flex " }}
                                    />
                                    {validation.touched.firstName &&
                                    validation.errors.firstName ? (
                                      <div
                                        type="invalid"
                                        style={{ color: "red" }}
                                      >
                                        {validation.errors.firstName}
                                      </div>
                                    ) : null}
                                  </div>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <div>
                                    <div>
                                      Middle Name
                                      <span style={{ color: "red" }}>*</span> :
                                    </div>
                                    <TextField
                                      id="middleName"
                                      name="middleName"
                                      disabled={!isUpdateOpen}
                                      multiline
                                      maxRows={4}
                                      variant="filled"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.middleName || ""}
                                      sx={{ display: "flex " }}
                                    />
                                    {validation.touched.middleName &&
                                    validation.errors.middleName ? (
                                      <div
                                        type="invalid"
                                        style={{ color: "red" }}
                                      >
                                        {validation.errors.middleName}
                                      </div>
                                    ) : null}
                                  </div>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <div>
                                    <div>
                                      Last Name
                                      <span style={{ color: "red" }}>*</span> :
                                    </div>
                                    <TextField
                                      id="lastName"
                                      name="lastName"
                                      disabled={!isUpdateOpen}
                                      multiline
                                      maxRows={4}
                                      variant="filled"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.lastName || ""}
                                      sx={{ display: "flex " }}
                                    />
                                    {validation.touched.lastName &&
                                    validation.errors.lastName ? (
                                      <div
                                        type="invalid"
                                        style={{ color: "red" }}
                                      >
                                        {validation.errors.lastName}
                                      </div>
                                    ) : null}
                                  </div>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <div>
                                    Phone Number
                                    <span style={{ color: "red" }}>*</span> :
                                  </div>
                                  <TextField
                                    id="phoneNo"
                                    name="phoneNo"
                                    disabled={!isUpdateOpen}
                                    variant="filled"
                                    inputProps={{ maxLength: 10 }}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.phoneNo || ""}
                                    sx={{ display: "flex " }}
                                  />
                                  {validation.touched.phoneNo &&
                                  validation.errors.phoneNo ? (
                                    <div
                                      type="invalid"
                                      style={{ color: "red" }}
                                    >
                                      {validation.errors.phoneNo}
                                    </div>
                                  ) : null}
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <div>
                                    Address
                                    <span style={{ color: "red" }}>*</span> :
                                  </div>
                                  <TextField
                                    id="address"
                                    name="address"
                                    disabled={!isUpdateOpen}
                                    multiline
                                    maxRows={4}
                                    variant="filled"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.address || ""}
                                    sx={{ display: "flex " }}
                                  />
                                  {validation.touched.address &&
                                  validation.errors.address ? (
                                    <div
                                      type="invalid"
                                      style={{ color: "red" }}
                                    >
                                      {validation.errors.address}
                                    </div>
                                  ) : null}
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <div>Email :</div>
                                  <TextField
                                    id="email"
                                    name="email"
                                    disabled={!isUpdateOpen}
                                    variant="filled"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.email || ""}
                                    sx={{ display: "flex " }}
                                  />
                                  {validation.touched.email &&
                                  validation.errors.email ? (
                                    <div
                                      type="invalid"
                                      style={{ color: "red" }}
                                    >
                                      {validation.errors.email}
                                    </div>
                                  ) : null}
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <div>Passbook Number :</div>
                                  <TextField
                                    id="passbookId"
                                    name="passbookId"
                                    disabled
                                    variant="filled"
                                    // onChange={validation.handleChange}
                                    // onBlur={validation.handleBlur}
                                    value={validation.values.passbookId || ""}
                                    sx={{ display: "flex " }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <div>Joining Date :</div>
                                  <input
                                    type="text"
                                    name="date"
                                    id="date"
                                    disabled
                                    style={{
                                      display: "flex",
                                      padding: "14px",
                                      borderTop: 0,
                                      borderLeft: 0,
                                      borderRight: 0,
                                      borderBottom: isUpdateOpen
                                        ? "1px solid gray"
                                        : "1px solid rgba(0, 0, 0, 0.12)",
                                      width: "215px",
                                      backgroundColor: isUpdateOpen
                                        ? "rgba(0, 0, 0, 0.06)"
                                        : "rgba(0, 0, 0, 0.12",
                                      borderRadius: " 5px 5px 0 0",
                                    }}
                                    // value={validation.values.date || ""}
                                    value={
                                      moment(validation.values.date).format(
                                        "DD-MMM-YYYY"
                                      ) || ""
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                            {isUpdateOpen ? (
                              <div class="container">
                                <div class="row">
                                  <button
                                    type="submit"
                                    className="btn btn-success mr-3 col-12 col-sm-3 my-3"
                                  >
                                    Submit
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary col-12 col-sm-3 my-3"
                                    onClick={() => {
                                      setIsUpdateOpen(false);
                                      setImageUrl("");
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div class="container">
                                <div class="row">
                                  <div
                                    className="btn btn-primary mr-3 col-12 col-sm-3 my-3"
                                    onClick={() => setIsUpdateOpen(true)}
                                  >
                                    Update Details
                                  </div>
                                  <div
                                    className="btn btn-primary mr-3 col-12 col-sm-3 my-3"
                                    onClick={() =>
                                      navigate("/customerTransactionList", {
                                        state: {
                                          data: customerData,
                                          from: "/customer",
                                        },
                                      })
                                    }
                                  >
                                    View Transactions
                                  </div>
                                  <div
                                    className="btn btn-primary col-12 col-sm-3 my-3"
                                    onClick={() =>
                                      navigate(location.state.from, {
                                        state: {
                                          data: customerData,
                                          from: "/customer",
                                        },
                                      })
                                    }
                                  >
                                    View Customer List
                                  </div>
                                </div>
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </form>
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

export default CustomerPage;
