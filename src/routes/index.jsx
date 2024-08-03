import React from "react";
import CustomerPage from "../components/CustomerPage";
import CustomerTransactions from "../components/CustomerTransactions";

const Home = React.lazy(() => import("../components/Home"));
const Login = React.lazy(() => import("../components/Login"));
const NotFound = React.lazy(() => import("../components/NotFound"));
const Registration = React.lazy(() => import("../components/Registration"));
const CustomerList = React.lazy(() => import("../components/CustomerList"));
const ForgotPassword = React.lazy(() => import("../components/ForgotPassword"));

const protectedRoutes = [
  { path: "/", component: <Home /> },
  { path: "/registration", component: <Registration /> },
  { path: "/customerList", component: <CustomerList /> },
  { path: "/customer", component: <CustomerPage /> },
  { path: "/customerTransactionList", component: <CustomerTransactions /> },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/forgotPassword", component: <ForgotPassword /> },
  {
    path: "*",
    component: <NotFound />,
  },
];

const adminProtectedRoutes = [
  //   { path: "/studentList", component: <StudentList /> },
];

export { protectedRoutes, publicRoutes, adminProtectedRoutes };
