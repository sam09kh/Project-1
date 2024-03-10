import React, { useState } from "react";
import Navbar from "../Header/Navbar";
import { Navigate } from "react-router-dom";

const Manager = () => {
  const [credentials, setCredentials] = useState({
    email: "",
  });
  const handleLogin = async () => {
    try {
      const { email } = credentials;
      const response = await fetch(
        "http://localhost:4560/api/auth/loginmanager",
        {
          method: "post",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (data) {
        alert(data.message);
        Navigate(`/expenselist`);
      } else {
        alert(response.message);
      }
    } catch (error) {
      throw new Error("error", error);
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Navbar />
      <div className="manager relative top-28 flex items-center justify-center flex-col bg-slate-300">
        <form
          className="w-22 h-22 space-y-4 md:space-y-6"
          onSubmit={handleLogin}
        >
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              onChange={onChange}
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              required=""
            />
          </div>
          <button
            type="submit"
            className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-6 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Login in
          </button>
        </form>
      </div>
    </>
  );
};

export default Manager;
