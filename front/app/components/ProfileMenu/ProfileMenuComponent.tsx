"use client";
import React, { Fragment, useState } from "react";
import CountrySelector from "./CountrySelectorComponent";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import {
  faArrowRightFromBracket,
  faGear,
  faPalette,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ColourSelector from "./ColourSelectorComponent";

interface IProfileMenuProps {
  colour: string;
  setColour: (colour: string) => void;
}

export default function ProfileMenu(props: IProfileMenuProps) {
  const { colour, setColour } = props;

  const { t, i18n } = useTranslation();
  let [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <Menu as="div" className="relative ml-3">
      <ColourSelector
        open={settingsOpen}
        setOpen={setSettingsOpen}
        colour={colour}
        setColour={setColour}
      />
      <div>
        <Menu.Button
          className={`relative flex rounded-full bg-${colour}-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-${colour}-800`}>
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <Image
            src={`/images/avatar/1.jpg`}
            alt="Johnny Silverhand"
            className={`w-16 h-16 ring-4 ring-${colour}-500 transform hover:scale-110 transition-all duration-200 rounded-full`}
            width={128}
            height={128}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items
          className={`absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md divide-y divide-${colour}-200 bg-${colour}-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
          <div className="px-1 py-1 ">
            <Menu.Item>
              <p
                className={`rounded-md px-4 py-2 text-lg hover:bg-${colour}-700 text-sky-100`}>
                Johnny Silverhand
              </p>
            </Menu.Item>
          </div>
          <div className="px-1 py-1 ">
            <Menu.Item>
              <div
                className={`rounded-md px-4 py-2 hover:bg-${colour}-700 flex items-center gap-2 `}>
                <FontAwesomeIcon icon={faUser} className={`text-sky-100`} />
                <p className={`text-sky-100 `}>{t("myProfile")}</p>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div
                className={`rounded-md px-4 py-2 hover:bg-${colour}-700 flex items-center gap-2 `}
                onClick={() => setSettingsOpen(!settingsOpen)}>
                <FontAwesomeIcon icon={faPalette} className={`text-sky-100`} />
                <p className={`text-sky-100 `}>{t("settings")}</p>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div
                className={`rounded-md px-4 py-2 hover:bg-${colour}-700 flex items-center gap-2 `}>
                <CountrySelector />
              </div>
            </Menu.Item>
          </div>
          <div className="px-1 py-1 ">
            <Menu.Item>
              <div
                className={`rounded-md px-4 py-2 hover:bg-${colour}-700 flex items-center gap-2 `}>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className={`text-sky-100`}
                />
                <p className={`text-sky-100 `}>{t("logOut")}</p>
              </div>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
