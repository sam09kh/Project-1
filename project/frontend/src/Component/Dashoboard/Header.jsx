import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Header = () => {
  const auth = localStorage.getItem("auth");
  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const [employeeId, setEmployeeId] = useState("");
  const { employeesId } = useParams();
  console.log(employeeId);
  async function functionCall() {
    const myHeader = new Headers();
    myHeader.append("Authorization", `${JSON.parse(auth).authToken}`);
    const response = await fetch("http://localhost:4560/api/auth/getuser", {
      method: "get",
      headers: myHeader,
    });
    const data = await response.json();
    setEmployeeId(data.user._id);
  }
  useEffect(() => {
    functionCall();
  }, []);
  return (
    <div className="relative">
      <ul className="flex">
        <li className="px-7 py-2 m-4 tex-xl text-blue-900 bg-green-200 hover:bg-green-500">
          <Link>Home</Link>
        </li>
        <li className="px-7 py-2 m-4 tex-xl text-blue-900 bg-green-200 hover:bg-green-500">
          <Link to={`/expenselist/${employeeId}`}>Expense List </Link>
        </li>
        <li className="px-7 py-2 m-4 tex-xl text-blue-900 bg-green-200 hover:bg-green-500">
          <Link>About</Link>
        </li>
        {auth ? (
          <li
            onClick={handlelogout}
            className="flex justify-end px-7 py-2 m-4 tex-xl text-blue-900 bg-green-200 hover:bg-green-500"
          >
            <Link>Logout</Link>
          </li>
        ) : (
          <li className="flex justify-end px-7 py-2 m-4 tex-xl text-blue-900 bg-green-200 hover:bg-green-500">
            <Link>Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;
