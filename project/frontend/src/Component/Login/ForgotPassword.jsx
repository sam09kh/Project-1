import React from "react";

const ForgotPassword = () => {
  return (
    <div id="forgot">
      <div className="container w-full flex-direction-column relative top-4rem ">
        <h1>Forgot Password</h1>
        <form action="#/">
          <div className="input-box center space-between relative top-2rem">
            <span>1</span>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter Email"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
