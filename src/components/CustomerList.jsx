import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { Pagination, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Footer from "./Footer";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { get, post } from "../services/apiServices";
import LoadingSkeleton from "../commonComponents/LoadingSkeleton";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import moment from "moment";

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

function CustomerList() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openAddMoney, setOpenAddMoney] = useState(false);
  const [openAddMoneyConfirm, setOpenAddMoneyConfirm] = useState(false);
  const [amountToDeposit, setAmountToDeposit] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [customerPassbookId, setCustomerPassbookId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth > 576);
    };

    // Attach the event listener for window resizee
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // for pagination start
  const handleChange = (event, value) => {
    setPage(value);
  };

  // for pagination endd

  const [customerData, setCustomerData] = useState([]);
  const getCustomerList = async () => {
    try {
      setIsLoading(true);
      const response = await get(
        `api/customerList?page=${page}&itemsPerPage=${itemsPerPage}&name=${name}&email=${email}&mobileNo=${phoneNo}`
      );
      setCustomerData(response.data.data);
      setTotalPagesCount(response.data.totalPagesCount);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const [allCustomerData, setAllCustomerData] = useState([]);
  const getAllCustomerList = async () => {
    try {
      setIsLoading(true);
      const response = await get(
        `api/customerList?name=${name}&email=${email}&mobileNo=${phoneNo}`
      );
      setAllCustomerData(response.data.data);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCustomerList();
    getAllCustomerList();
  }, [itemsPerPage, page, dataUpdated]);

  // confirm delete modal start

  const handleOpenConfirmDelete = (id) => {
    console.log(id, "id");
    setDeleteId(id);
    setOpenConfirmDelete(true);
  };
  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await get(`/api/deleteCustomer?customerId=${deleteId}`);
      setDataUpdated(!dataUpdated);
      setOpenConfirmDelete(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
    }
  };
  // confirm delete modal end
  // add money modal start

  const handleOpenAddMoneyPopUp = (customer) => {
    console.log(customer, "customer");
    setCustomerName(
      customer.firstName + " " + customer.middleName + " " + customer.lastName
    );
    setCustomerPassbookId(customer?.passbookId);
    setOpenAddMoney(true);
  };
  const handleCloseAddMoneyPopUp = () => {
    setOpenAddMoney(false);
  };
  // add money modal end

  // validation for amount start
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      amount: "",
    },
    validationSchema: Yup.object({
      amount: Yup.string()
        .required("Please enter the amount")
        .test("Digits only", "The field should have digits only", (value) =>
          /^\d+$/.test(value)
        ),
    }),

    onSubmit: async (values, { resetForm }) => {
      setOpenAddMoneyConfirm(true);
      setAmountToDeposit(values.amount);
      resetForm();
    },
  });
  // validation for amount end

  // confirm add money modal starts her

  const handleConfirmAddMoney = async () => {
    console.log("handleConfirmAddMoney");

    try {
      let dataToSend = {
        amount: amountToDeposit,
        passbookId: customerPassbookId,
      };

      setIsLoading(true);
      let response = await post("/api/addMoney", dataToSend);
      if (response?.data?.status == "Success") {
        setOpenAddMoneyConfirm(false);
        setOpenAddMoney(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
    }
  };

  const handleCloseConfirmAddMoney = () => {
    setOpenAddMoneyConfirm(false);
  };
  // confirm add money modal end

  // download excel using xlsx
  // const handleExcelFile = () => {
  //   let filteredData = customerData.map(
  //     ({ _id, createdAt, updatedAt, __v, profilePicPath, ...rest }) => rest
  //   );
  //   let workSheet = XLSX.utils.json_to_sheet(filteredData);
  //   let workBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workBook, workSheet, "sheet1");
  //   XLSX.writeFile(workBook, "data.xlsx");
  // };

  const headers = [
    { label: "First Name", key: "firstName" },
    { label: "Middle Name", key: "middleName" },
    { label: "Last Name", key: "lastName" },
    { label: "Mobile No.", key: "mobileNo" },
    { label: "Email", key: "email" },
    { label: "Joining Date", key: "joiningDate" },
    { label: "Address", key: "address" },
    { label: "Passbook Id", key: "passbookId" },
  ];

  let csvData = allCustomerData;

  return (
    <div className="app-container">
      <Header />
      <div className="invoice-add-table customerList content">
        <div className="p-2 mx-4 d-flex row customerListHeader">
          <div className="col-12 col-md-2">
            <label className="d-block form-label" htmlFor="name">
              <h4>Name</h4>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Please Enter Name"
              className="form-control lable-margin referral-input1 center_button inputFocus"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="d-block" htmlFor="email">
              <h4>Email</h4>
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Please Enter Email"
              className="form-control lable-margin referral-input1 center_button inputFocus"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="d-block" htmlFor="phoneNo">
              <h4>Phone No</h4>
            </label>
            <input
              type="text"
              name="phoneNo"
              id="phoneNo"
              placeholder="Please Enter Phone Number"
              className="form-control lable-margin referral-input1 center_button inputFocus"
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-2" style={{ marginTop: "30px" }}>
            <label className="d-block" htmlFor="class">
              <h4></h4>
            </label>
            <button
              className="btn btn-dark px-4 form-control btnPaddingStudent button"
              onClick={() => getCustomerList()}
            >
              Search
            </button>
          </div>
          <Tooltip title="Download Report">
            <div className="col-12 col-md-2">
              <CSVLink
                data={csvData}
                headers={headers}
                filename={`Customer_list_on_${moment(new Date()).format(
                  "DD-MMM-YYYY"
                )}.csv`}
                target="_blank"
                className="btn btn-primary mb-3 customerListDownload"
              >
                <CloudDownloadIcon />
              </CSVLink>
            </div>
          </Tooltip>
        </div>
        <div className="row mx-2 mt-2">
          <div className="col-lg-12">
            <div className="table-responsive box_shadow py-2">
              <table className="table table-striped table-nowrap  mb-0 no-footer add-table-items">
                <thead>
                  <tr className="text-center">
                    <th>Sr No.</th>
                    <th>Customer Name</th>
                    <th>Passbook Number</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Add Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {isLoading ? (
                  <tbody>
                    <tr className="text-center">
                      <td colSpan="8">
                        <LoadingSkeleton />
                      </td>
                    </tr>
                  </tbody>
                ) : customerData && customerData.length > 0 ? (
                  customerData?.map((customer, index) => {
                    return (
                      <tbody key={index}>
                        <tr className="text-center">
                          <td>
                            <b>{index + 1 + (page - 1) * itemsPerPage}</b>
                          </td>
                          <td>
                            {!!customer?.firstName ? (
                              <Tooltip title="View Customer Details">
                                <div
                                  onClick={() =>
                                    navigate("/customer", {
                                      state: {
                                        from: "/customerList",
                                        data: customer,
                                      },
                                    })
                                  }
                                  className="customerDetails"
                                >
                                  {customer?.firstName +
                                    " " +
                                    customer?.middleName +
                                    " " +
                                    customer.lastName}
                                </div>
                              </Tooltip>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {!!customer?.passbookId ? customer.passbookId : "-"}
                          </td>
                          <td>{!!customer?.email ? customer.email : "-"}</td>
                          <td>
                            {!!customer?.mobileNo ? customer.mobileNo : "-"}
                          </td>
                          <td>
                            {!!customer?.address ? customer.address : "-"}
                          </td>
                          <td className="icons">
                            <div
                              onClick={() => handleOpenAddMoneyPopUp(customer)}
                            >
                              <Tooltip title="Add Money">
                                <CurrencyRupeeIcon />
                              </Tooltip>
                            </div>
                          </td>

                          <td className="d-flex icons" style={{ gap: "10px" }}>
                            <div
                              onClick={() =>
                                navigate("/customerTransactionList", {
                                  state: {
                                    from: "/customerList",
                                    data: customer,
                                  },
                                })
                              }
                            >
                              <Tooltip title="View Customer Transactions">
                                <AccountBalanceWalletIcon />
                              </Tooltip>
                            </div>
                            <div
                              onClick={() =>
                                handleOpenConfirmDelete(customer?._id)
                              }
                            >
                              <Tooltip title="Delete Customer">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="16"
                                  width="14"
                                  viewBox="0 0 448 512"
                                >
                                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                </svg>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })
                ) : (
                  <tbody>
                    <tr>
                      <th className="text-center" colSpan="8">
                        No Data Available
                      </th>
                    </tr>
                  </tbody>
                )}
              </table>

              <div className="d-flex justify-content-between mt-3">
                <Pagination
                  count={totalPagesCount}
                  page={page}
                  onChange={handleChange}
                  color="primary"
                  shape="rounded"
                />

                <div>
                  <span className="mx-2">Select</span>
                  <select
                    id="itemsPerPage"
                    className="inputFocus"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(e.target.value)}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="mx-2">Items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <Modal
        open={openConfirmDelete}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            className="text-center"
            variant="h6"
            component="h2"
          >
            Are you sure to delete the user ?
          </Typography>
          <Typography
            id="modal-modal-description"
            className="buttonGroup"
            sx={{ mt: 2 }}
          >
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Confirm
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseConfirmDelete}
            >
              Cancel
            </button>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openAddMoney}
        onClose={handleCloseAddMoneyPopUp}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form
            className="form-horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Typography
              id="modal-modal-title"
              className="text-center"
              variant="h6"
              component="h2"
            >
              <div className="informationText">
                Below amount will be added to account of{" "}
              </div>
              <div className="highlightText">
                <b>{customerName}</b>
              </div>
              <TextField
                name="amount"
                label="Please Enter Amount"
                variant="outlined"
                value={validation.values.amount || ""}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
              />
              {validation.touched.amount && validation.errors.amount ? (
                <div type="invalid" style={{ color: "red" }}>
                  {validation.errors.amount}
                </div>
              ) : null}
            </Typography>
            <Typography
              id="modal-modal-description"
              className="buttonGroup"
              sx={{ mt: 2 }}
            >
              <button type="submit" className="btn btn-success">
                Confirm
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseAddMoneyPopUp}
              >
                Cancel
              </button>
            </Typography>
          </form>
        </Box>
      </Modal>

      <Modal
        open={openAddMoneyConfirm}
        onClose={handleCloseConfirmAddMoney}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            className="text-center"
            variant="h6"
            component="h2"
          >
            {`₹${amountToDeposit} will be added to account of ${customerName} `}
          </Typography>
          <Typography
            id="modal-modal-description"
            className="buttonGroup"
            sx={{ mt: 2 }}
          >
            <button
              type="button"
              className="btn btn-success"
              onClick={handleConfirmAddMoney}
              disabled={isLoading}
            >
              Confirm
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseConfirmAddMoney}
              disabled={isLoading}
            >
              Cancel
            </button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default CustomerList;
