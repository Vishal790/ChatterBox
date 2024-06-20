import React, { useState } from "react";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Badge, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Search from "../NavComponents/Search";
import Notifications from "../NavComponents/Notifications";
import NewGroup from "../NavComponents/NewGroup";
import { useDispatch, useSelector } from "react-redux";

import logo from "../../assets/Images/logo.png";


import { logout } from "../../services/operations/auth";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotifications,
  setIsSearch,
} from "../../redux/slices/miscSlice";
import { resetNotificationCount } from "../../redux/slices/chatSlice";
const Navbar = () => {
  const navigate = useNavigate();

  //states for functions

  // const[isMobile,setIsMobile] = useState(false);
  // const[isSearch,setIsSearch] = useState(false);
  const {isNewGroup} = useSelector((state) => state.misc)
  const [isNotification, setIsNotification] = useState(false);

  const dispatch = useDispatch();

  const { isMobile } = useSelector((state) => state.misc);
  const { isSearch } = useSelector((state) => state.misc);
  const { isNotifications } = useSelector((state) => state.misc);
  const { notificationsCount } = useSelector((state) => state.chat);

  const handleMobile = () => {
    dispatch(setIsMobile(true));
  };

  const handleSearch = () => {
    //console.log("handle search clicked");
    dispatch(setIsSearch(true));
  };

  const handleNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const handleOpenNotification = () => {
    dispatch(setIsNotifications(true));
    dispatch(resetNotificationCount());
  };

  const handleManageGroup = () => {
    navigate("/groups");
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <>
      <div className=" h-[3.5rem] sticky  shadow-white">
        <div className="flex max-w-maxContent w-11/12 mx-auto justify-between  items-center h-full">
          <IconButton
            className="!text-white !block sm:!hidden"
            onClick={handleMobile}
          >
            <MenuIcon />
          </IconButton>
          <div className="hidden sm:block" onClick={()=>navigate("/home")} >
            <img className="h-[45px]" src={logo} alt="" />
          </div>

          <div className="flex justify-center items-center text-2xl gap-x-3 md:gap-x-8 overflow-x-auto thin-scrollbar">
            <abbr title="Search Users">
              <div className="hover:rounded-md hover:bg-nav-icon-hover">
                {" "}
                <IconButton
                  size="large"
                  sx={{ fontSize: "2.5rem" }}
                  onClick={handleSearch}
                >
                  <SearchIcon className="text-nav-icon-color hover:text-white" />
                </IconButton>
              </div>
            </abbr>

            <abbr title="Create New Group">
              <div className="hover:rounded-md hover:bg-nav-icon-hover">
                {" "}
                <IconButton
                  size="large"
                  sx={{ fontSize: "2.5rem" }}
                  onClick={handleNewGroup}
                >
                  <GroupAddIcon className="text-nav-icon-color hover:text-white" />
                </IconButton>
              </div>
            </abbr>

            <abbr title="Manage Groups">
              <div className="hover:rounded-md hover:bg-nav-icon-hover">
                {" "}
                <IconButton
                  size="large"
                  sx={{ fontSize: "2.5rem" }}
                  onClick={handleManageGroup}
                >
                  <GroupsIcon className="text-nav-icon-color hover:text-white" />
                </IconButton>
              </div>
            </abbr>

            <abbr title="Friend Requests">
              <div className="hover:rounded-md hover:bg-nav-icon-hover relative">
                {" "}
                {/* Removed padding and kept relative position */}
                <IconButton
                  size="large"
                  sx={{ fontSize: "2.5rem" }}
                  onClick={handleOpenNotification}
                >
                  {notificationsCount > 0 && (
                    <div
                      style={{ right: "0.5rem", top: "0.5rem" }}
                      className="text-richblack-900 text-sm min-w-[8px] min-h-[8px] bg-yellow-5 rounded-full absolute"
                    >
                      {/* {notificationsCount} */}
                    </div>
                  )}
                  <NotificationsIcon className="text-nav-icon-color hover:text-white" />
                </IconButton>
              </div>
            </abbr>

            <abbr title="Logout">
              <div className="hover:rounded-md hover:bg-nav-icon-hover">
                {" "}
                <IconButton
                  size="large"
                  sx={{ fontSize: "2.5rem" }}
                  onClick={handleLogout}
                >
                  <LogoutIcon className="text-nav-icon-color hover:text-white" />
                </IconButton>
              </div>
            </abbr>
          </div>
        </div>
      </div>
      {isSearch && <Search />}
      {isNotifications && <Notifications />}
      {isNewGroup && <NewGroup />}
    </>
  );
};

export default Navbar;
