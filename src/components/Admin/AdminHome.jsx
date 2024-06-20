import { AdminPanelSettings, Group, Message, Notifications, Person } from "@mui/icons-material";
import { Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import Widgets from "./Widgets";
import { DoughnutChart, LineChart } from "./Charts";

const AdminHome = () => {
  return (
    <div className=" py-20  min-h-screen p-4 flex flex-col gap-y-10  w-10/12 mx-auto ">
      {/* Search bar */}

      <div className=" w-full bg-white rounded-xl h-fit  py-4 flex items-center justify-around tab-shadow">
        <AdminPanelSettings sx={{ fontSize: "2rem" }} />
        <div className=" flex gap-x-5">
          <input
            className=" px-3 py-2 rounded-full bg-pure-greys-25  "
            placeholder="Search..."
          />

          <button className="bg-richblack-900 text-white px-5 py-2 rounded-3xl">
            Search
          </button>
        </div>

        <Typography className="hidden lg:block">
          {moment().format("dddd, MMMM Do YYYY")}
        </Typography>
        <Notifications />
      </div>

      <div className=" w-full flex flex-col items-center gap-y-5 lg:items-start lg:flex-row lg:justify-between flex-grow">
        <div className="  w-full h-fit  lg:w-[65%] p-2 bg-white rounded-xl   py-4 items-center justify-around tab-shadow">
          <h1 className="text-center my-3">Last messages</h1>
          <LineChart value={[12, 43, 23, 54, 15]} />
        </div>
        <div className=" w-7/12  lg:w-[32%]  bg-white rounded-xl  flex flex-col py-2 px-4 items-center justify-around tab-shadow">
          <h1 className="text-center">Single Vs Group Chats</h1>
          <DoughnutChart
            labels={["Single Chats", "Group Chats"]}
            value={[23, 66]}
          />
        </div>
      </div>

      <div className=" flex items-center justify-between w-full mt-auto  ">
        <Widgets title={"Users"} value={20} icon={<Person />} />
        <Widgets title={"Chats"} value={7} icon={<Group />} />
        <Widgets title={"Messages"} value={230} icon={<Message />} />
      </div>
    </div>
  );
};

export default AdminHome;
