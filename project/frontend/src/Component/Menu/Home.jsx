import React from "react";
import Navbar from "../Header/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home relative top-32 flex items-center justify-center">
        <h1 className="text-4xl">Welcome Expense Approval System</h1>
      </div>
    </>
  );
};

export default Home;
