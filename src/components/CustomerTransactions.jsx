import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { Pagination, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import Footer from "./Footer";
import { get, post } from "../services/apiServices";
import moment from "moment";
import LoadingSkeleton from "../commonComponents/LoadingSkeleton";
import { CSVLink } from "react-csv";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

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

function CustomerTransactions() {
  const location = useLocation();

  const customer = location.state.data.passbookId;
  const customerName =
    location.state.data.firstName +
    " " +
    location.state.data.middleName +
    " " +
    location.state.data.lastName;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [searchAmount, setSearchAmount] = useState("");
  const [amountReceivedBy, setAmountReceivedBy] = useState("");
  const [amountModalOpen, setAmountModalOpen] = useState(false);
  const [totalBalance, setTotalBalance] = useState("");
  const [listUpdated, setListUpdated] = useState("");

  const [transactionData, setTransactiondata] = useState([]);

  const handleTransactionList = async () => {
    try {
      setIsLoading(true);

      const response = await get(
        `api/transactionList?page=${page}&itemsPerPage=${itemsPerPage}&customer=${customer}&amount=${searchAmount}&amountReceivedBy=${amountReceivedBy}`
      );

      setTransactiondata(response?.data?.data);
      setTotalPagesCount(response?.data?.totalPagesCount);
      setTotalBalance(response?.data?.totalBalance);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // for pagination start
  const handleChange = (event, value) => {
    setPage(value);
  };

  // for pagination end

  //   amount edit modal start

  const [passbookId, setPassbookId] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(null);
  const handleOpenAmountEditModal = (customer) => {
    setAmountModalOpen(true);
    setPassbookId(customer.passbookId);
    setTransactionAmount(customer.amount);
    setTransactionId(customer._id);
  };
  const handleCloaseAmountEditModal = () => {
    setAmountModalOpen(false);
  };
  //   amount edit modal end

  // validation for amount start
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      amount: transactionAmount,
    },
    validationSchema: Yup.object({
      amount: Yup.string()
        .required("Please enter the amount")
        .test("Digits only", "The field should have digits only", (value) =>
          /^\d+$/.test(value)
        ),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const data = {
          amount: values.amount,
          passbookId: passbookId,
          id: transactionId,
        };

        try {
          setIsLoading(true);
          const response = await post("/api/editAddedMoney", data);

          if (response?.data?.status == "Success") {
            setAmountModalOpen(false);
            resetForm();
            setListUpdated(!listUpdated);
          }
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    },
  });
  // validation for amount end

  const headers = [
    { label: "Amount", key: "amount" },
    { label: "Received By", key: "receivedBy" },
    { label: "Received Date", key: "createdAt" },
    { label: "Updated By", key: "updatedBy" },
    { label: "Updated Date", key: "updatedAt" },
  ];

  const [transactiondataForDownload, setTransactiondataForDownload] = useState(
    []
  );

  const downloadExcel = async () => {
    try {
      setIsLoading(true);

      const response = await get(
        `api/transactionList?customer=${customer}&amount=${searchAmount}&amountReceivedBy=${amountReceivedBy}`
      );

      setTransactiondataForDownload(response?.data?.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  console.log(transactiondataForDownload, "transactiondataForDownload");

  let csvData = transactiondataForDownload.map((item) => ({
    ...item,
    createdAt: moment(item.createdAt).format("DD-MMM-YYYY"),
    updatedAt: moment(item.updatedAt).format("DD-MMM-YYYY"),
  }));

  useEffect(() => {
    handleTransactionList();
    downloadExcel();
  }, [itemsPerPage, page, listUpdated]);

  return (
    <div className="app-container">
      <Header />
      <div className="invoice-add-table customerList content">
        <div className="p-2 mx-4 d-flex row customerListHeader justify-content-between">
          <div className="col-12 col-md-2">
            <label className="d-block form-label" htmlFor="name">
              <h4>Amount</h4>
            </label>
            <input
              type="text"
              name="searchAmount"
              id="searchAmount"
              placeholder="Please Enter Amount"
              className="form-control lable-margin referral-input1 center_button inputFocus"
              onChange={(e) => setSearchAmount(e.target.value)}
              value={searchAmount}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="d-block form-label" htmlFor="name">
              <h4>Received By</h4>
            </label>
            <input
              type="text"
              name="receivedBy"
              id="receivedBy"
              placeholder="Please Enter Name"
              className="form-control lable-margin referral-input1 center_button inputFocus"
              onChange={(e) => setAmountReceivedBy(e.target.value)}
              value={amountReceivedBy}
            />
          </div>
          <div className="mr-3 col-12 col-md-3" style={{ marginTop: "40px" }}>
            <button
              className="btn btn-dark px-4 form-control btnPaddingStudent button"
              onClick={handleTransactionList}
            >
              Search
            </button>
          </div>
          <div className="col-12 col-md-3 col-12 divCenter">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/customerList")}
            >
              Go To Customer List
            </button>

            <Tooltip title="Download Report">
              <div className="">
                <CSVLink
                  data={csvData}
                  headers={headers}
                  filename={`Transaction_list_for_passbook_No_${customer}_on_${moment(
                    new Date()
                  ).format("DD-MMM-YYYY")} .csv`}
                  target="_blank"
                  className="btn btn-primary mb-3 TransactionListDownload"
                >
                  <CloudDownloadIcon />
                </CSVLink>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="row mx-2 mt-2">
          <div className="col-lg-12">
            <div className="table-responsive box_shadow py-2">
              <div className="d-flex justify-content-between mx-3">
                <div className="py-3">
                  <b>Depositer Name : {customerName}</b>
                </div>
                <div className="py-3">
                  <b>Total Balance : ₹ {totalBalance ? totalBalance : 0}</b>
                </div>
              </div>
              <table className="table table-striped table-nowrap  mb-0 no-footer add-table-items">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Amount</th>
                    <th>Received By</th>
                    <th>Received Date</th>
                    <th>Updated By</th>
                    <th>Updated Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {isLoading ? (
                  <tbody>
                    <tr>
                      <td colSpan="8">
                        <LoadingSkeleton />
                      </td>
                    </tr>
                  </tbody>
                ) : transactionData && transactionData.length > 0 ? (
                  transactionData?.map((customer, index) => {
                    return (
                      <tbody key={index}>
                        <tr>
                          <td>
                            <b>{index + 1 + (page - 1) * itemsPerPage}</b>
                          </td>
                          <td>{!!customer?.amount ? customer.amount : "-"}</td>
                          <td>
                            {!!customer?.receivedBy ? customer.receivedBy : "-"}
                          </td>
                          <td>
                            {!!customer?.createdAt
                              ? moment(customer.createdAt).format("DD-MMM-YYYY")
                              : "-"}
                          </td>
                          <td>
                            {!!customer?.updatedBy ? customer.updatedBy : "-"}
                          </td>
                          <td>
                            {!!customer?.updatedAt
                              ? moment(customer.updatedAt).format("DD-MMM-YYYY")
                              : "-"}
                          </td>
                          <td className="d-flex icons" style={{ gap: "10px" }}>
                            <div
                              onClick={() =>
                                handleOpenAmountEditModal(customer)
                              }
                            >
                              <Tooltip title="Edit Amount">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="16"
                                  width="16"
                                  viewBox="0 0 512 512"
                                >
                                  <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
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
                      <th className="text-center" colSpan="7">
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
      <Modal
        open={amountModalOpen}
        onClose={handleCloaseAmountEditModal}
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
              <div>Amount To Deposit</div>
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
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success"
              >
                {isLoading ? "Updating..." : "Confirm"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isLoading}
                onClick={handleCloaseAmountEditModal}
              >
                Cancel
              </button>
            </Typography>
          </form>
        </Box>
      </Modal>
      <Footer />
    </div>
  );
}

export default CustomerTransactions;
