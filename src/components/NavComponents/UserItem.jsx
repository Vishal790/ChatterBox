import { Avatar, IconButton, Typography } from "@mui/material";
import React, { memo } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { transformImage } from "../../utils/features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling,
}) => {
  const { name, _id, avatar } = user;

  //console.log(user);

  const maxChars = 15;
  const trimmedName =
    name.length > maxChars ? `${name.substring(0, maxChars)}...` : name;

  return (
    <li
      className={`p-2 border-b border-gray-300  flex items-center justify-between ${
        styling && "border border-black border-opacity-60 rounded-2xl"
      }`}
      style={styling}
    >
      <div className={`flex items-center gap-x-5 `}>
        <Avatar src={transformImage(avatar)} />
        <div>
          <h1 className="ml-2">{trimmedName}</h1>
          {user.userName && (
            <div className="flex ">
              <p className="text-xs">@</p>
              <p className="text-xs">{user.userName}</p>
            </div>
          )}
        </div>
      </div>
      <IconButton onClick={() => handler(_id)} disabled={handlerIsLoading}>
        {isAdded ? <RemoveIcon /> : <AddIcon />}
      </IconButton>
    </li>
  );
};

export default memo(UserItem);
