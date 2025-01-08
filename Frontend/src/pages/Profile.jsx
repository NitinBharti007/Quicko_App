import React from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import UserProfileEdit from "../components/UserProfileEdit";

const Profile = () => {
  const user = useSelector((state) => state.user);

  return (
    <div>
      <div className="w-20 h-20 bg-red-500 flex justify-center items-center rounded-full overflow-hidden drop-shadow-sm">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-auto" />
        ) : (
          <FaUserCircle size={65} />
        )}
      </div>
      <button className="text-sm border border-primary-100 rounded-full px-3 py-1 mt-2 min-w-20 hover:bg-primary-200">
        Edit
      </button>
      <UserProfileEdit />
    </div>
  );
};

export default Profile;
