import React from "react";
import ProfileMenu from "./ProfileMenu/ProfileMenuComponent";

interface INavbarComponentProps {
  colour: string;
  setColour: (colour: string) => void;
}

const NavbarComponent = (props: INavbarComponentProps) => {
  const { colour, setColour } = props;

  return (
    <div
      className={`w-full bg-${colour}-700 h-24 flex justify-center content-center`}>
      <p className={`text-${colour}-100 self-center text-5xl`}>
        The Weathermen
      </p>
      <div className="absolute right-0 mx-6 self-center">
        <ProfileMenu colour={colour} setColour={setColour} />
      </div>
    </div>
  );
};

export default NavbarComponent;
