import React, { useEffect, useState } from "react";
import { sampleUsers } from "../SampleData/sampleData";
import UserItem from "../NavComponents/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/slices/miscSlice";
import { fetchMyFriends } from "../../services/operations/user";
import Spinner from "../utils/Spinner";
import { addMember, getChatDetails } from "../../services/operations/chat";
import { useNavigate, useSearchParams } from "react-router-dom";

const AddMemberModal = ({ isLoadingAddMember, fetchGroupDetails }) => {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatMembers, setChatMembers] = useState([]);
  const dispatch = useDispatch();
  const [filteredFriends, setFilteredFriends] = useState([]);

  //console.log("Chat Id: " ,chatId);
  const [searchParams] = useSearchParams();
  //onsole.log("searchParams:", searchParams.toString());
  const chatId = searchParams.get("group");
  //console.log("chatId:", chatId);

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsResponse = await fetchMyFriends();
        const chatDetailsResponse = await getChatDetails(chatId, token);

        if (!friendsResponse || friendsResponse.data === null) {
          console.log("Friends data is null or undefined");
          setMembers([]);
        } else {
          setMembers(friendsResponse.data);
        }

        if (
          !chatDetailsResponse ||
          !chatDetailsResponse.data ||
          !chatDetailsResponse.data.members
        ) {
          console.log("Chat details data is null or undefined");
          setChatMembers([]);
        } else {
          setChatMembers(chatDetailsResponse.data.members);

          // console.log("Friends response",friendsResponse);
          // console.log("chatmembers response",chatDetailsResponse);

          // Filter friends who are not already members of the chat
          const chatMemberIds = chatDetailsResponse.data.members.map(
            (member) => member._id
          );
          const filtered = friendsResponse.filter(
            (friend) => !chatMemberIds.includes(friend._id)
          );
          setFilteredFriends(filtered);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId && token) {
      fetchData();
    }
  }, [chatId, token]);

  const closeHandler = () => {
    setSelectedMembers([]);
    setMembers([]);
    dispatch(setIsAddMember(false));
  };

  const selectMemberHandler = (id) => {
    // Implement member selection logic

    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentMember) => currentMember !== id)
        : [...prev, id]
    );

    console.log(selectedMembers);
  };

  const addMemberSubmitHandler = async () => {
    try {
      const response = await addMember(token, chatId, selectedMembers);

      if (!response) {
        console.log("Error adding member");
        return;
      }
      fetchGroupDetails(chatId)
      //navigate("/groups");
      closeHandler();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-[25rem] max-h-[500px]">
        <h2 className="text-lg font-semibold mb-4 text-center">Add Members</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">Friends</p>

        <div>
          {!loading && filteredFriends?.length > 0 ? (
            filteredFriends.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p>No Friends</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-2">
          <button
            onClick={addMemberSubmitHandler}
            disabled={isLoadingAddMember}
            className=" bg-caribbeangreen-400 hover:bg-caribbeangreen-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-200"
          >
            Submit Changes
          </button>
          <button
            onClick={closeHandler}
            className="bg-puregrey-200 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
