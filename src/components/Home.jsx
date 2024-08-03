import React, { useEffect, useState } from "react";
import Header from "./Header";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CardPage from "../helpers/CardPage";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { get } from "../services/apiServices";

function Home() {
  const navigation = useNavigate();
  const [totalMoney, setTotalMoney] = useState(0);
  const [weeklyMoneyCount, setWeeklyMoneyCount] = useState(0);
  const [monthlyMoneyCount, setMonthlyMoneyCount] = useState(0);

  const getDashboardData = async () => {
    const response = await get("/api/dashboardData");
    console.log(response, "dashboardData");
    setTotalMoney(response.data.totalMoney);
    setWeeklyMoneyCount(response.data.weeklyMoneyCount);
    setMonthlyMoneyCount(response.data.monthlyMoneyCount);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <div className="content mainPage">
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 5,
          }}
        >
          <CardPage timeline="Yearly" amount={totalMoney} />
          <CardPage timeline="Monthly" amount={monthlyMoneyCount} />
          <CardPage timeline="Weekly" amount={weeklyMoneyCount} />
        </Box>
        <div className="d-flex justify-content-center pt-5">
          <Button
            variant="contained"
            onClick={() => navigation("/registration")}
          >
            Register New User
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
