import React, { useEffect, useState } from "react";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Person2Icon from "@mui/icons-material/Person2";
import ProfileCard from "./ProfileCard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import { useSelector } from "react-redux";
import { getProfile } from "../../services/operations/user";
import axios from "axios";

const Profile = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getProfileData = async () => {
    setLoading(true);
    try {
      const response = await getProfile();
      setProfileData(response);
    //  console.log("Response ", response);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } 
      setLoading(false); 
    
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <div className="h-full flex flex-col p-10 items-center">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <img
            src={profileData?.avatar.url || "default_avatar_url"} // Provide a default avatar URL if profileData.avatar is null
            alt="Profile Avatar"
            className="w-[200px] h-[200px] rounded-full border-4 border-white mb-4 object-cover"
          />
          <div className=" flex flex-col gap-y-5">
            <ProfileCard
              heading={"Name"}
              text={profileData?.name || "N/A"}
              icon={Person2Icon}
            />
            <ProfileCard heading={"Bio"} text={profileData?.bio || "N/A"} />
            <ProfileCard
              heading={"Username"}
              text={profileData?.userName || "N/A"}
              icon={AlternateEmailIcon}
            />
            <ProfileCard
              heading={"Joined"}
              text={
                profileData ? moment(profileData.createdAt).fromNow() : "N/A"
              }
              icon={CalendarMonthIcon}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
