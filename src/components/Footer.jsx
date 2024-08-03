import React, { useState } from "react";

function Footer() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container-fluid bg-footer text-white py-5 px-sm-3 px-md-5">
      <div className="container-fluid pt-5">
        <p className="m-0 text-center text-white">
          &copy;
          <a className="text-primary font-weight-bold" href="#">
            Fund Collection
          </a>
          . All Rights Reserved. Designed by
          <a className="text-primary font-weight-bold" href="#">
            &nbsp; Fund Collection
          </a>
          <br />
          Distributed By:
          <a href="#" target="_blank">
            &nbsp;Fund Collection
          </a>
        </p>
      </div>
    </div>
  );
}

export default Footer;
