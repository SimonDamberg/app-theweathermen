"use client";
import React, { useEffect } from "react";
import registerPasswordEmail from "@/firebase/auth/register";
import "../i18n";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { renderRain } from "../../utils/rain";
import { useAuthContext } from "@/context/AuthContext";
import { googleLogin } from "@/firebase/auth/login";
import { alertFailure } from "@/utils/notify";

const Register = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const { user } = useAuthContext();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleForm = async (event: any) => {
    event.preventDefault();
    registerPasswordEmail(name, email, password)
      .then((res) => {
        router.push("/");
      })
      .catch((err) => {
        alertFailure(t("somethingWentWrong"));
      });
  };

  useEffect(() => {
    const cont = document.getElementById("rainContainer");
    renderRain(cont, 30);
  }, []);

  return (
    <div
      id="rainContainer"
      className="relative bg-slate-950 h-screen flex items-center justify-between wrapper flex-col overflow-hidden">
      <Image
        src="/images/logo/logo.png"
        width={512}
        height={512}
        alt="logo"
        className="z-10 invert mt-32 transition-all ease-in-out duration-1000 transform hover:scale-110"
        priority
      />
      <div className="z-10 form-wrapper rounded-xl bg-slate-800 p-8 hover:shadow-xl hover:shadow-slate-600 transition-all transform ease-in-out hover:-translate-y-4 duration-1000">
        <h1 className="mb-2 text-2xl font-bold text-slate-100">
          {t("register")}
        </h1>
        <form onSubmit={handleForm}>
          <label htmlFor="name">
            <p className="text-slate-100 mb-2">{t("name")}</p>
            <input
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
              name="name"
              id="name"
              placeholder={t("name").toLowerCase()}
              autoComplete="name"
              className="mb-4 bg-slate-700 text-slate-100 border-2 border-slate-300 rounded-lg p-2"
            />
          </label>
          <label htmlFor="email">
            <p className="text-slate-100 mb-2">{t("email")}</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="example@mail.com"
              className="mb-4 bg-slate-700 text-slate-100 border-2 border-slate-300 rounded-lg p-2"
            />
          </label>
          <label htmlFor="password">
            <p className="text-slate-100 mb-2">{t("password")}</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder={t("password").toLowerCase()}
              className="bg-slate-700 text-slate-100 border-2 border-slate-300 rounded-lg p-2"
            />
          </label>
          <button
            type="submit"
            className="ml-2 rounded-lg p-2 text-slate-100 bg-slate-500 hover:bg-slate-700 transition-all ease-in-out duration-200">
            {t("register")}
          </button>
        </form>
        <p className="mt-4 text-slate-100">
          {t("haveAccount")}{" "}
          <a
            href="/login"
            className="text-slate-100 hover:text-slate-300 underline transition-all ease-in-out">
            {t("login")}
          </a>
        </p>
        <div className=" select-none flex my-4">
          <div className=" select-none h-0.5 flex-1 bg-gray-200 self-center rounded-full"></div>
          <div className=" select-none flex-1 text-center text-gray-300">
            {t("or")}
          </div>
          <div className=" select-none h-0.5 flex-1 bg-slate-200 self-center rounded-full"></div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="w-full select-none flex rounded-lg bg-slate-300 hover:bg-slate-500 transition-all ease-in-out duration-200"
            onClick={() => googleLogin()}>
            <Image
              height={36}
              width={36}
              alt="google logo"
              className=" select-none ml-3"
              src="/images/providers/google.png"></Image>

            <span className="select-none self-center text-sm flex-1 text-left text-slate-700">
              {t("googleLogin")}
            </span>
          </button>
        </div>
      </div>
      <div className="h-64"></div>
    </div>
  );
};

export default Register;
