import React from "react";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import NonAuthLayout from "./AuthPages/NonAuthLayout";
import Authmiddleware from "./AuthPages/AuthLayout";
import AdminAuthmiddleware from "./AuthPages/AdminAuthLayout";
import { adminProtectedRoutes, protectedRoutes, publicRoutes } from "./routes";
import { ErrorBoundary } from "react-error-boundary";
import NotFound from "./components/NotFound";

function Root() {
  return (
    <>
      <ErrorBoundary fallback={<NotFound />}>
        <Suspense
          fallback={
            <div className="col-12">
              <div className="animatedDiv4"></div>
            </div>
          }
        >
          <Routes>
            {publicRoutes.map((route, idx) => (
              <Route
                path={route.path}
                element={<NonAuthLayout>{route.component}</NonAuthLayout>}
                key={idx}
                exact={true}
              />
            ))}

            {adminProtectedRoutes.map((route, idx) => (
              <Route
                path={route.path}
                element={
                  <AdminAuthmiddleware>{route.component}</AdminAuthmiddleware>
                }
                key={idx}
                exact={true}
              />
            ))}

            {protectedRoutes.map((route, idx) => (
              <Route
                path={route.path}
                element={<Authmiddleware>{route.component}</Authmiddleware>}
                key={idx}
                exact={true}
              />
            ))}
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        closeButton={
          <button
            style={{
              width: "30px",
              backgroundColor: "inherit",
              border: "none",
              color: "white",
            }}
          >
            X
          </button>
        }
      />
    </>
  );
}

export default Root;
