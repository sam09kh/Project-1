import React, { useEffect, useState } from "react";
import Navbar from "../Header/Navbar";
import { useLocation, useParams } from "react-router-dom";
import Header from "./Header";

const Expenselist = () => {
  const auth = localStorage.getItem("auth");

  const { employeesId } = useParams();
  const Location = useLocation();
  const [expenses, setExpenses] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
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
    const id = data2.map((value) => value._id);
  }
  const handleUpdateStatus = async (status) => {
    try {
      const response = await fetch(
        `http://localhost:4560/api/auth/expenses/${selectedExpenseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (data) {
        alert(data.message);
        console.log(data.createdAt);
      }
      setSelectedStatus(null);
    } catch (error) {
      console.error("Error updating expense status:", error);
    }
  };
  useEffect(() => {
    Getemployeedata();
  }, []);

  useEffect(() => {
    // Ensure that the status is updated before calling handleUpdateStatus
    if (selectedExpenseId && selectedStatus !== null) {
      handleUpdateStatus(selectedStatus);
    }
  }, [selectedExpenseId, selectedStatus]);

  return (
    <>
      {Location.pathname === `/expenselist/${employeeId}` ? (
        <>
          <Navbar />
          <div className="relative top-24 p-3 flex flex-col gap-4">
            <h1>Expense List</h1>
            {expenses.map((expense) => {
              return (
                <div
                  key={expense._id}
                  className="w-52 h-48 bg-slate-300 p-2 mb-4"
                >
                  <p>Description: {expense.description}</p>
                  <p>Amount: {expense.amount}</p>
                  <button
                    onClick={() => {
                      handleUpdateStatus("Approved");
                      setSelectedExpenseId(expense._id);
                    }}
                    className="p-2 mt-2 bg-white text-xl text-slate-900"
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateStatus("Rejected");
                      setSelectedExpenseId(expense._id);
                    }}
                    className="p-2 mt-2 mx-2 bg-white text-xl text-slate-900"
                  >
                    Reject
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Header />
          <div className="listy relative top-28 flex items-center justify-center">
            <h1>WElcome manager</h1>
          </div>
        </>
      )}
    </>
  );
};

export default Expenselist;
