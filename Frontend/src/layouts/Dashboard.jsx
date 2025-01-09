import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto p-6 grid lg:grid-cols-[250px,1fr]">
        {/* Left for menu  */}
        <div className="px-5 sticky top-28 overflow-y-auto hidden lg:block border-r">
            <UserMenu/>
        </div>

        {/* right for content */}
        <div className="bg-white min-h-[72vh]">
            <Outlet/>            
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
