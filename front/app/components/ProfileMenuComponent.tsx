"use client";
import {
  faArrowRightFromBracket,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import React from "react";

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title="Profile">
        <IconButton onClick={handleClick}>
          <Avatar
            src={`/images/avatar/1.jpg`}
            alt="Johnny Silverhand"
            className="w-16 h-16"
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
            <p className=" text-white">
              Johnny <br />
              Silverhand
            </p>
          </div>
        </MenuItem>
        <Divider className="bg-white mx-3" />
        <MenuItem className="flex items-center gap-2 my-2">
          <FontAwesomeIcon icon={faUser} style={{ color: "#90A4AE" }} />
          <p className="text-white">My Profile</p>
        </MenuItem>
        <MenuItem className="flex items-center gap-2 my-2">
          <FontAwesomeIcon icon={faGear} style={{ color: "#90A4AE" }} />
          <p className="font-medium text-white">Settings</p>
        </MenuItem>
        <Divider className="bg-white mx-3" />
        <MenuItem className="flex items-center gap-2 my-2">
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            style={{ color: "#90A4AE" }}
          />
          <p className="font-medium text-white">Log Out</p>
        </MenuItem>
      </Menu>
    </>
  );
}
