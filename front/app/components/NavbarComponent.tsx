import React from "react";
import ProfileMenu from "./ProfileMenu/ProfileMenuComponent";
import Image from "next/image";
import { AuthContext, useAuthContext } from "@/context/AuthContext";

const NavbarComponent = () => {
  const { theme } = useAuthContext();

  return (
    <div
      className={`w-full bg-${theme}-700 h-24 flex justify-between content-center`}>
      <div className="md:w-full w-2/3 self-center">
        <Image
          src={`/images/logo/logo.png`}
          alt=""
          width={313}
          height={10}
          className="py-4 pl-4"
        />
      </div>
      <div className="absolute right-0 mx-6 self-center">
        <ProfileMenu />
      </div>
    </div>
  );
};

export default NavbarComponent;
