import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ICircleButtonProps {
  icon?: IconDefinition;
  onClick: () => void;
}

const CircleButtonComponent = (props: ICircleButtonProps) => {
  return (
    <div
      className="bg-sky-700 rounded-full w-16 h-16 flex justify-center m-6 cursor-pointer hover:bg-sky-800 transition-all	ease-in-out duration-300"
      onClick={() => props.onClick()}
    >
      {props.icon ? (
        <FontAwesomeIcon
          icon={props.icon}
          className="text-sky-200 text-2xl self-center"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default CircleButtonComponent;
