import React from "react";

const ProfileCard = ({heading, text, icon: Icon }) => {
  return (
    <div className=" flex flex-col ">
      <h1 className="text-center text-pure-greys-200">{heading}</h1>
      <div className=" flex items-center justify-center mt-3">
        {Icon && <Icon className="text-white mr-2" />}
        <h1 className="text-white">{text}</h1>
      </div>
    </div>
  );
};

export default ProfileCard;
