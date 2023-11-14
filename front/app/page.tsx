"use client";

import CircleButtonComponent from "./components/CircleButtonComponent";
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";

// import Image from "next/image";
// import { useEffect, useState } from "react";

// Logic and styling for main page

export default function Home() {
  return (
    <>
      <div className="absolute right-0 bottom-0 flex flex-row">
        <div className="-mr-8">
          <CircleButtonComponent icon={faPen} onClick={() => null} />
        </div>
        <CircleButtonComponent icon={faPlus} onClick={() => null} />
      </div>
    </>
  );
}
