import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import UserItem from "./UserItem";
import { sampleUsers } from "../SampleData/sampleData";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/slices/miscSlice";
import { searchUsers, sendFriendRequest } from "../../services/operations/user";
import debounce from "lodash/debounce";
import Spinner from "../utils/Spinner";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const { isSearch } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseSearch = () => {
    dispatch(setIsSearch(false));
  };

  //first call
  // useEffect(() => {
  //   if (searchTerm.length == 0) handleSearch(searchTerm);
  // }, [searchTerm]);


  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchUsers(searchTerm, token);

    //  console.log("Response search", response);

      setUsers(response);
    } catch (error) {
      console.log("Error Searching users...", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 1000);


    return ()=> clearTimeout(timer);
    
  }, [searchTerm]);

  const addFriendHandler = async(id) => {
   // console.log("id", id);
    try{

      const response  =  await sendFriendRequest(id,token);
      console.log("Friend Request sent", response);

    }
    catch(error) {
      console.log(error.message);
    };
  };

  let isLoadingSendFriendRequest = false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-filter backdrop-blur-sm">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white p-4 rounded-lg min-w-fit  h-[500px] w-[25rem] ">
        <div className="flex items-center justify-between mb-6 ">
          <h1 className="text-lg font-semibold mx-auto text-center">
            Find People
          </h1>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleCloseSearch}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex items-center  text-center justify-center w-full gap-x-5 ">
          <div className=" mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Search"
              className="w-full border border-gray-300 rounded-full px-3 py-2 "
            />
          </div>

          <IconButton
            onClick={handleSearch}
            style={{ color: "#3b444b", fontSize: "24px" }}
          >
            <PersonSearchIcon />
          </IconButton>
        </div>

        <div className="mt-2 h-[75%] overflow-auto scrollbar-thin scrollbar-track-richblack-25 scrollbar-thumb-richblack-300">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center"><Spinner/></div>
          ) : (
            <ul className="list-none p-0">
              {users.map((item) => (
                <UserItem
                  avatar={item.avatar}
                  key={item._id}
                  user={item}
                  handler={addFriendHandler}
                  handlerIsLoading={isLoadingSendFriendRequest}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
