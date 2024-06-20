import React from "react";
import { transformImage } from "../../utils/features";
const AvatarCard = ({ avatar, max = 4 }) => {
  return (
    <div className="flex space-x-[-1.5rem] relative">
      {avatar.slice(0, max).map((src, index) => (
        <img
          key={index}
          src={transformImage(src)}
          alt={`avatar-${index}`}
          className="w-10 h-10 border-2 border-white rounded-full"
          style={{ zIndex: max - index }}
        />
      ))}
      {avatar.length > max && (
        <div className="w-8 h-8 border-2 border-white flex items-center justify-center rounded-full absolute top-0 left-[-1.5rem]">
          +{avatar.length - max}
        </div>
      )}
    </div>
  );
};

export default AvatarCard;
