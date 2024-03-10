import React from "react";
import Expense from "./Expense";
import Logonav from "../Header/Logonav";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");
  const handlelogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <div className="flex items-center justify-around">
        <Logonav />
        <ul className="flex relative">
          <li className="mx-3 p-1">
            <Link to="/">Home</Link>
          </li>
          <li className="mx-3 p-1">
            <Link to="/showmessage">List</Link>
          </li>
          <li className="mx-3 p-1">
            <Link>Services</Link>
          </li>
          {auth ? (
            <li onClick={handlelogout} className="mx-3 p-1">
              <Link>Logout</Link>
            </li>
          ) : (
            <li className="mx-3 p-1">
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="expense">
        <Expense />
      </div>
    </>
  );
};

export default Dashboard;
