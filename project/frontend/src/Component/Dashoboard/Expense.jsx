import React, { useEffect, useState } from "react";

const Expense = () => {
  const auth = localStorage.getItem("auth");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [employee, setEmployee] = useState("");
  async function Getemployeedata() {
    const myHeader = new Headers();
    myHeader.append("Authorization", `${JSON.parse(auth).authToken}`);
    const response = await fetch("http://localhost:4560/api/auth/getuser", {
      method: "get",
      headers: myHeader,
    });
    const data = await response.json();
    setEmployee(data.user.email);
  }
  useEffect(() => {
    Getemployeedata();
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const myHeader = new Headers();
    myHeader.append("Authorization", `${JSON.parse(auth).authToken}`);
    myHeader.append("Content-Type", "application/json");
    // Implement logic to send expense data to the server
    const resposne = await fetch("http://localhost:4560/api/auth/expenses", {
      method: "post",
      body: JSON.stringify({ description, amount }),
      headers: myHeader,
    });
    const data = await resposne.json();
    console.log(data);
  };
  return (
    <div className="relative top-36 flex items-center justify-center flex-col">
      <h1>Name: {employee}</h1>
      <h2>Expense Submission</h2>
      <form onSubmit={handleSubmit} className="flex items-center flex-col">
        <label>
          Description:
          <input
            type="text"
            value={description}
            className="p-4 m-4"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            className="p-4 m-4"
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <button type="submit" className="bg-slate-800 p-4 text-cyan-200">
          Submit Expense
        </button>
      </form>
    </div>
  );
};

export default Expense;
