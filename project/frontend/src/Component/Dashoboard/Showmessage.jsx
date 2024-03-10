import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Logonav from "../Header/Logonav";

const Showmessage = () => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");
  const handlelogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const { employeesId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  async function Getemployeedata() {
    const myHeader = new Headers();
    myHeader.append("Authorization", `${JSON.parse(auth).authToken}`);
    const response = await fetch("http://localhost:4560/api/auth/getuser", {
      method: "get",
      headers: myHeader,
    });
    const data = await response.json();
    setEmployeeId(data.user._id);
    const respone2 = await fetch(
      `http://localhost:4560/api/auth/expenses/${employeesId}`,
      {
        method: "get",
        headers: myHeader,
      }
    );
    const data2 = await respone2.json();
    setExpenses(data2);
  }

  useEffect(() => {
    Getemployeedata();
  }, []);
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
      <div className="message relative top-10 flex items-center flex-col">
        <h1>Request Messages</h1>
        {expenses.map((expensed) => {
          return (
            <div className="row w-80 p-3 h-32 overflow-hidden m-10 bg-slate-400 flex items-center justify-center flex-col">
              <p>Description: {expensed.description}</p>
              <p>Amount: {expensed.amount}</p>
              <p>Status: {expensed.status}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Showmessage;
