"use client";
import {
  faArrowRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import React from "react";
import CountrySelector from "./CountrySelectorComponent";
import { Lexend } from "next/font/google";
import { useTranslation } from "react-i18next";

const lexend = Lexend({ subsets: ["latin"] });

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { t, i18n } = useTranslation();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title={t("profile")}>
        <IconButton onClick={handleClick}>
          <Avatar
            src={`/images/avatar/1.jpg`}
            alt="Johnny Silverhand"
            className="w-16 h-16 ring-4 ring-sky-400 transform hover:scale-110 transition-all duration-200"
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          "& .MuiMenu-paper": {
            backgroundColor: "rgb(12 74 110)",
            color: "#E5E7EB",
          },
        }}>
        <MenuItem onClick={handleClose} className="">
          <div className="flex items-center">
            <Avatar
              src={`/images/avatar/1.jpg`}
              alt="Johnny Silverhand"
              className="
          bg-sky-600 w-14 h-14 mr-4"
            />
            <p className={`text-sky-100 ${lexend.className}`}>
              Johnny <br />
              Silverhand
            </p>
          </div>
        </MenuItem>
        <Divider className="bg-sky-100 mx-3" />
        <MenuItem className="flex items-center gap-2 my-2">
          <FontAwesomeIcon icon={faUser} style={{ color: "#90A4AE" }} />
          <p className={`text-sky-100 ${lexend.className}`}>{t("myProfile")}</p>
        </MenuItem>
        <MenuItem className="flex items-center gap-2 my-2">
          <CountrySelector />
        </MenuItem>
        <Divider className="bg-sky-100 mx-3" />
        <MenuItem className="flex items-center gap-2 my-2">
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            style={{ color: "#90A4AE" }}
          />
          <p className={`text-sky-100 ${lexend.className}`}>{t("logOut")}</p>
        </MenuItem>
      </Menu>
    </>
  );
}
