import React, { memo } from "react";
import { Link } from "react-router-dom";
import AvatarCard from "../Chat/AvatarCard";

const GroupListItem = ({ group, chatId, setIsMobileOpen }) => {
  const { name, avatar, _id } = group;


  const handleClick = (e) => {
    if (chatId === _id) {
      e.preventDefault();
    } else {
      setIsMobileOpen(false);
      e.stopPropagation();
    }
  };

  return (
    <Link to={`?group=${_id}`} onClick={handleClick}>
      <div className="flex gap-x-10 px-2 items-center">
        <AvatarCard avatar={avatar} />
        <h2>{name}</h2>
      </div>
    </Link>
  );
};

export default memo(GroupListItem);
