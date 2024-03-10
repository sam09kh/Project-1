import React from "react";
import { Link } from "react-router-dom";
import Logonav from "./Logonav";

const Navbar = () => {
  const auth = localStorage.getItem("auth");
  return (
    <div id="navbar">
      <div className="flex items-center justify-around">
        <Logonav />
        <ul className="flex relative">
          <li className="mx-3 p-1">
            <Link to="/">Home</Link>
          </li>
          <li className="mx-3 p-1">
            <Link>About</Link>
          </li>
          <li className="mx-3 p-1">
            <Link>Services</Link>
          </li>
          {!auth ? (
            <li className="mx-3 p-1">
              <Link to="/manager">Manager</Link>
            </li>
          ) : null}
          {auth ? (
            <li className="mx-3 p-1">
              <Link to="/dashboard">Dashboard</Link>
            </li>
          ) : (
            <li className="mx-3 p-1">
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
