import React, { useEffect, useState } from "react";
import { sampleUsers } from "../SampleData/sampleData";
import CloseIcon from "@mui/icons-material/Close";

import UserItem from "./UserItem";
import toast from "react-hot-toast";
import { fetchMyFriends } from "../../services/operations/user";
import Spinner from "../utils/Spinner";
import { createGroup } from "../../services/operations/chat";
import { useDispatch, useSelector } from "react-redux";
import { setIsNewGroup } from "../../redux/slices/miscSlice";

const NewGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  
  const fetchFriendList = async () => {
    try {
      const response = await fetchMyFriends();
      if (!response) {
        console.log("ERROR IN FETCHING FRIENDS");
      }
      //  console.log("Friends fetched",response);
      setMembers(response);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendList();
  }, []);

  const selectMemberHandler = (item) => {
    // Implement member selection logic

    setSelectedMembers((prev) =>
      prev.includes(item._id)
        ? prev.filter((currentMember) => currentMember !== item._id)
        : [...prev, item._id]
    );
  };
  console.log(selectedMembers);

  const handleClose = () => {
    // Implement close functionality
    dispatch(setIsNewGroup(false))
  };

  const handleCreateGroup = async () => {
    if(groupName.trim().length===0) return toast.error("Please enter a group name");
    if(selectedMembers.length<2) return toast.error("Please select at least 2 members");
    try {
      const response = createGroup(token, groupName, selectedMembers);
      if (!response) {
        console.log("error creating group");
      }
    } catch (error) {
      console.log(error.message);
    }
    finally{
      handleClose();
    }
  };

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-filter backdrop-blur-sm">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white p-4 rounded-lg min-w-fit w-96">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold mx-auto text-center">
            New Group
          </h1>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="groupName" className="block mb-1">
            Group Name:
          </label>
          <input
            id="groupName"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={groupName}
            onChange={handleGroupNameChange}
          />
        </div>
        <h1 className="text-center text-lg mb-4">Members</h1>
        <ul className="list-none p-0">
          {loading ? (
            <Spinner />
          ) : (
            members.map((item) => (
              <UserItem
                avatar={item.avatar}
                key={item._id}
                user={item}
                handler={() => selectMemberHandler(item)}
                isAdded={selectedMembers.includes(item._id)}
              />
            ))
          )}
        </ul>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded mr-2"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-caribbeangreen-600 text-white rounded"
            onClick={handleCreateGroup}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroup;
