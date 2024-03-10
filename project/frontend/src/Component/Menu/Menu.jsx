import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "../Login/Login";
import "../MainStyles.css";
import Signup from "../Login/Signup";
// import Dashboard from "../Dashoboard/DashBoard";
import PrivateRoute from "../PrivateComponent/PrivateRoute";
import Notfound from "../Notfound";
import Dashboard from "../Dashoboard/Dashboard";
import Expenselist from "../Dashoboard/Expenselist";
import Manager from "../Login/Admin";

const Menu = () => {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="*" exact element={<Notfound />} />
        <Route
          path="/dashboard"
          exact
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/signup" exact element={<Signup />} />
        <Route path="/manager" exact element={<Manager />} />
        <Route path="/expenseList" element={<Expenselist />} />
        <Route path="/expenselist/:employeesId" element={<Expenselist />} />
      </Routes>
    </>
  );
};

export default Menu;
