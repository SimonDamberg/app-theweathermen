import React from "react";

interface ILocationProps {
  name?: string;
  // TODO weatherData
}

const LocationComponent = (props: ILocationProps) => {
  const { name } = props;
  return (
    <div className="cursor-pointer w-300 h-full p-10 rounded-xl bg-sky-800 hover:bg-sky-900 shadow shadow-sky-600/50 transition-all ease-in-out duration-300">
      <p className="text-4xl text-sky-200">{name ? name : "Test"}</p>
    </div>
  );
};

export default LocationComponent;
