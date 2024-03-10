import React from "react";
import Expense from "./Expense";
import Navbar from "../Header/Navbar";

const Dashboard = () => {
  // const auth = localStorage.getItem("auth");
  return (
    <>
      <Navbar />
      <div className="expense">
        <Expense />
      </div>
    </>
  );
};

export default Dashboard;
