import React from "react";
import { Link } from "react-router-dom";
import Logonav from "./Logonav";

const Navbar = () => {
  return (
    <div id="navbar">
      <div className="flex items-center justify-around">
        <Logonav />
        <ul className="flex relative">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link>About</Link>
          </li>
          <li>
            <Link>Services</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
