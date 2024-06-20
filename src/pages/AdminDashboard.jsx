import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import { IconButton, Menu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { adminRoutes } from "../utils/adminRoutes";
import toast from "react-hot-toast";
import { ExitToApp } from "@mui/icons-material";

const AdminDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();

  const logoutHandler = () => {
    toast.success("Logged out");
  };

  const handleMobile = () => setIsMobile(!isMobile);
  return (
    <div className="grid grid-cols-12  h-screen ">
      <div className="block md:hidden fixed right-1 top-1 ">
        <IconButton onClick={handleMobile} sx={{color:"black"}}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </div>

      {/* Sidebar */}
      <div className=" hidden md:block md:col-span-4 lg:col-span-3 bg-red-400">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="col-span-12 md:col-span-8 lg:col-span-9 bg-pure-greys-5 ">
        <Outlet />
      </div>

      {/* Drawer */}
      {isMobile && (
        <div
          className={`fixed top-0  flex flex-col gap-y-10 left-0 p-2 w-5/12 h-full bg-red-400 backdrop-filter backdrop-blur-md ${
            isMobile ? "slide-in" : ""
          }`}
        >
          <Sidebar />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
