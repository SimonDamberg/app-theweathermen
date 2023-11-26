import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ICircleButtonProps {
  icon?: IconDefinition;
  iconClassName?: string;
  onClick: () => void;
  className: string;
  disabled?: boolean;
}

const CircleButtonComponent = (props: ICircleButtonProps) => {
  return (
    <div
      className={[
        "rounded-full flex justify-center",
        props.className,
        props.disabled
          ? "opacity-50"
          : "hover:opacity-70 cursor-pointer transition-all ease-in-out duration-300",
      ].join(" ")}
      onClick={props.disabled ? () => {} : props.onClick}>
      {props.icon ? (
        <FontAwesomeIcon
          icon={props.icon}
          className={[
            "text-sky-200 text-2xl self-center",
            props.iconClassName,
          ].join(" ")}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default CircleButtonComponent;
