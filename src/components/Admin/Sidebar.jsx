import React from 'react'
import { adminRoutes } from '../../utils/adminRoutes';
import { Link, useLocation } from 'react-router-dom';
import toast from "react-hot-toast";
import { ExitToApp } from "@mui/icons-material";

const Sidebar = () => {
   const location = useLocation();

   const logoutHandler = () => {
     toast.success("Logged out");
   };


  return (
    <div className='w-full py-10 '>
      <div className="mx-auto flex items-center justify-center text-white font-semibold text-3xl">
        <h1>Chatterbox</h1>
      </div>

      <ul className="className= flex flex-col gap-y-16 mx-auto mt-10  w-10/12">
        { adminRoutes.map((route) => (
          <Link
            className={` py-3 px-5 rounded-full ${
              route.path === location.pathname && "bg-richblack-700 text-white"
            } text-richblack-800 hover:text-white hover:bg-black hover:bg-opacity-20`}
            key={route.path}
            to={route.path}
          >
            <li className=" flex gap-x-3">
              <route.icon />
              {route.name}
            </li>
          </Link>
        ))}
        <Link
          onClick={logoutHandler}
          className={` py-3 px-5 rounded-full  text-richblack-800 hover:text-white hover:bg-black hover:bg-opacity-20`}
        >
          <li className=" flex gap-x-3">
            <ExitToApp />
            <h1>Logout</h1>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Sidebar