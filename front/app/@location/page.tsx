"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ILocationProps {
  name?: string;
  // TODO weatherData
}

export default function Location(props: ILocationProps) {
  const { name } = props;
  return (
    <div className="w-300 h-full p-10 rounded-xl bg-sky-800">
      <p className="text-3xl text-white">{name ? name : "Test"}</p>
    </div>
  );
}
