"use client";
import { Notify } from "notiflix/build/notiflix-notify-aio";

export const alertSuccess = (message: string) => {
  Notify.success(message, {
    timeout: 5000,
    position: "center-bottom",
    distance: "50px",
    fontFamily: "Lexend",
    fontSize: "14px",
    clickToClose: true,
    success: {
      background: "#22c55e",
      textColor: "#dcfce7",
      notiflixIconColor: "#dcfce7",
    },
    className: "text-center",
  });
};

export const alertFailure = (message: string) => {
  Notify.failure(message, {
    timeout: 5000,
    position: "center-bottom",
    distance: "50px",
    fontFamily: "Lexend",
    fontSize: "14px",
    clickToClose: true,
    failure: {
      background: "#ef4444",
      textColor: "#fee2e2",
      notiflixIconColor: "#fee2e2",
    },
    className: "text-center",
  });
};

export const alertInfo = (message: string) => {
  Notify.info(message, {
    timeout: 5000,
    position: "center-bottom",
    distance: "50px",
    fontFamily: "Lexend",
    fontSize: "14px",
    clickToClose: true,
    info: {
      background: "#64748b",
      textColor: "#f1f5f9",
      notiflixIconColor: "#f1f5f9",
    },
    className: "text-center",
  });
};
