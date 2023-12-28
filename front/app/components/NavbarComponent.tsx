import React from "react";
import ProfileMenu from "./ProfileMenu/ProfileMenuComponent";
import Image from "next/image";
import { AuthContext, useAuthContext } from "@/context/AuthContext";

const NavbarComponent = () => {
  const { theme } = useAuthContext();

  return (
    <div
      className={`w-full bg-${theme}-700 h-24 flex justify-between content-center`}>
      <Image
            src={`/images/logo/logo.png`}
            alt=""
            width={280}
            height={10}
            className="py-4 pl-4"
          />
      <div className="absolute right-0 mx-6 self-center">
        <ProfileMenu />
      </div>
    </div>
  );
};

export default NavbarComponent;
