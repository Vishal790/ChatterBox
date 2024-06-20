import React, { useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DoneIcon from "@mui/icons-material/Done";
import DeleteModal from "./DeleteModal";
import AddMemberModal from "./AddMemberModal";
import { sampleUsers } from "../SampleData/sampleData";
import UserItem from "../NavComponents/UserItem";
import { deleteChat, removeMember, renameGroup } from "../../services/operations/chat";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/slices/miscSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
const GroupCard = ({
  setMembers,
  members,
  groups,
  chatId,
  fetchGroupListDetails,
  fetchGroupDetails,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState(groups.name);
  const [updatedGroupName, setUpdatedGroupName] = useState(groups.name);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const chatId = useSearchParams()[0].get("group");


  //console.log("GRoups", groups);
  const { token } = useSelector((state) => state.auth);

  const handleEditGroupName = async () => {
    try {
      const response = await renameGroup(token, chatId, updatedGroupName);
      if (!response) {
        console.log("Error changing the group name");
      }
      setGroupName(response.data.name);
      fetchGroupListDetails();
      
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsEdit((prev) => !prev);
    }
  };

  useEffect(() => {
    return () => {
      // setGroupName("");
      setUpdatedGroupName("");
      setIsEdit(false);
    };
  }, [chatId]);

  const [deleteModal, setDeleteModal] = useState(false);
  const { isAddMember } = useSelector((state) => state.misc);

  const confirmDeleteHandler = async() => {
    try {
      const response = deleteChat(token, chatId);
      if(!response) {
        
          console.log("ERROR IN DELETING GROUP");
          return;
        }

      setDeleteModal(false);
      navigate('/groups')
      fetchGroupListDetails();
      
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeMemberHandler = async (id) => {
    setIsLoading(true);
    try {
      const response = await removeMember(token, id, chatId);
      if (!response) {
        return;
      }

      fetchGroupDetails(chatId)
      //navigate(`/groups`);
      
      console.log(response);
      return;
      // setMembers(response.data.members);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className=" flex flex-col mt-16 mb-8 h-full w-full  ">
        {!isEdit ? (
          <div className=" flex gap-x-5 items-center justify-center">
            <h1 className=" text-3xl font-inter font-semibold text-white">
              {groupName}
            </h1>
            {groupName && (
              <button className="text-white" onClick={() => setIsEdit(true)}>
                <ModeEditIcon />
              </button>
            )}
          </div>
        ) : (
          <div className=" flex gap-x-5 items-center justify-center">
            <input
              type="text"
              className=" text-3xl font-inter font-semibold text-center bg-receiver-message rounded-xl focus:outline-none focus:ring focus:border-richblack-900"
              value={updatedGroupName}
              onChange={(e) => setUpdatedGroupName(e.target.value)}
            />
            <button className="text-white" onClick={handleEditGroupName}>
              <DoneIcon />
            </button>
          </div>
        )}
      </div>

      {groupName && (
        <div className=" flex flex-col items-center gap-y-3 p-5">
          <h1 className="text-center text-white font-semibold text-xl w-full bg-red-400 py-2 px-3 rounded-md">
            Members
          </h1>

          <div className=" overflow-x-hidden overflow-y-auto  w-[80%] max-w-[35rem] max-h-[30rem] flex flex-col gap-y-5 mt-2 p-3 ">
            {!isLoading &&
              members &&
              members.length > 0 &&
              members?.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  isAdded
                  styling={{
                    // boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.4)",
                    padding: "1rem 2rem",
                    display: "flex",
                    flexDirection: "",
                    textColor: "white",
                    backgroundColor: "rgba(255, 255, 255)",
                  }}
                  handler={removeMemberHandler}
                />
              ))}
          </div>

          <div className="flex w-11/12 sm:justify-between flex-col sm:flex-row  items-center gap-y-2">
            <button
              onClick={() => dispatch(setIsAddMember(true))}
              className="bg-caribbeangreen-500 w-full sm:w-auto  hover:bg-caribbeangreen-500  text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-200"
            >
              Add Member
            </button>

            <button
              onClick={() => setDeleteModal(true)}
              className="px-3 py-2 w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold rounded focus:outline-none focus:ring focus:ring-red-200"
            >
              Delete Group
            </button>
          </div>
        </div>
      )}

      {isAddMember && (
        <AddMemberModal
          chatId={chatId}
          fetchGroupDetails={fetchGroupDetails}
          setIsAddMember={setIsAddMember}
        />
      )}

      {deleteModal && (
        <DeleteModal
          setDeleteModal={setDeleteModal}
          confirmDeleteHandler={confirmDeleteHandler}
        />
      )}
    </div>
  );
};

export default GroupCard;
