import { KeyboardBackspace } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { set } from "react-hook-form";
import GroupsList from "../components/Groups/GroupsList";
import { sampleChats } from "../components/SampleData/sampleData";
import GroupCard from "../components/Groups/GroupCard";
import { getChatDetails, getMyGroups } from "../services/operations/chat";
import Spinner from "../components/utils/Spinner";

const Groups = () => {
  const navigate = useNavigate();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [grplistLoading, setGrplistLoading] = useState(true);
  const [members,setMembers] = useState([]);


  const navigateBack = () => {
    navigate("/home");
  };

  const handleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const chatId = useSearchParams()[0].get("group");

  //console.log(chatId);

  const fetchGroupListDetails = async () => {
    try {
      const response = await getMyGroups();

      if (!response) {
        console.log("Error fetching in groups");
      }
      //console.log(response.data);
      setGroups(response.data);
    } catch (error) {
      console.log(error.message);
    }
    finally{
      setGrplistLoading(false);
    }
    
  };

  // const fetchGroupDetails = async () => {
  //   if (!chatId) {
  //      return;
  //   }
  //   try {
  //     const response = await getChatDetails(chatId);
  //     //console.log("response",response);
  //     setCurrentGroup(response.data);
  //     setMembers(response.data.members);

      
  //   } catch (error) {
  //     console.log(error.message);

  //   }
  //   finally{
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchGroupListDetails();
    // fetchGroupDetails();
  }, [chatId]);

   const fetchGroupDetails = async () => {
     if (!chatId) {
       return;
     }
     try {
       const response = await getChatDetails(chatId);
      // console.log("response",response);
       setCurrentGroup(response.data);
       setMembers(response.data.members);
     } catch (error) {
       console.log(error.message);
     } finally {
       setIsLoading(false);
     }
   };
  useEffect(() => {
   
    fetchGroupDetails();
  }, [chatId]);


  return (
    <div className="grid grid-cols-12 h-screen p-0 m-0 ">
      <div className=" hidden sm:block sm:col-span-4 bg-white-component  p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-richblack-900 ">
        <h1 className="text-center mb-10 mt-3 p-2  font-inter font-semibold text-white   bg-blue-800 rounded-2xl">
          My Groups
        </h1>
        <GroupsList
          myGroups={groups}
          chatId={chatId}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>

      <div className={` col-span-12 sm:col-span-8 relative overflow-auto  `}>
        <button
          onClick={navigateBack}
          className="bg-red-400 p-2 rounded-2xl text-richblack-800 hover:text-white absolute top-3 translate-x-4"
        >
          <KeyboardBackspace />
        </button>

        <button
          onClick={handleMobile}
          className=" block  sm:hidden  absolute top-3 z-20  right-4  text-white"
        >
          <MenuIcon />
        </button>

        {isLoading || !chatId ? (
          <div className="w-full h-full flex-col gap-y-10 flex justify-center items-center">
            <h1 className="text-white text-3xl">Select Group</h1>
            <Spinner />
          </div>
        ) : (
          <GroupCard
            setMembers={setMembers}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            members={members}
            groups={currentGroup}
            chatId={chatId}
            fetchGroupListDetails={fetchGroupListDetails}
            fetchGroupDetails={fetchGroupDetails}
          />
        )}
      </div>

      <div
        className={`sm:hidden absolute top-0 right-0 bg-red-400 z-10 backdrop-blur-sm  h-full  p-2 px-2 w-7/12 overflow-y-auto shadow-lg ${
          isMobileOpen ? "animate-slide-in" : "hidden"
        }`}
      >
        <div className=" p-2 mt-10  ">
          <h1 className="text-center mb-5 mt-2 p-2  font-inter font-semibold text-white bg-background-dark rounded-2xl ">
            My Groups
          </h1>

          <GroupsList myGroups={groups} chatId={chatId} />
        </div>
      </div>
    </div>
  );
};

export default Groups;
