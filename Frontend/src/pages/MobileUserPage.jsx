import React from "react";
import UserMenu from "../components/UserMenu";
import { IoClose } from "react-icons/io5";

const MobileUserPage = () => {
  return (
    <section className="bg-white w-full h-full py-2">
      <button onClick={()=> window.history.back()} className="text-neutral-800 block w-fit ml-auto">
        <IoClose size={24}/>
      </button>
      <div className="container mx-auto px-3 pb-8">
        <UserMenu />
      </div>
    </section>
  );
};

export default MobileUserPage;
