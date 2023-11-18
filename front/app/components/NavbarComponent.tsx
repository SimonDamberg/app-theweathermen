import React from "react";
import ProfileMenu from "./ProfileMenuComponent";

const NavbarComponent = () => {
  return (
    <div className="w-full bg-sky-800 h-24 flex justify-center content-center">
      <p className="text-sky-200 self-center text-5xl">The Weathermen</p>
      <div className="absolute right-0 mx-6 self-center">
        <ProfileMenu />
      </div>
    </div>
  );
};

export default NavbarComponent;
