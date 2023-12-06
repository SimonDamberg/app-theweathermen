"use client";
import React, { useEffect } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { useTranslation } from "react-i18next";
import { Lexend } from "next/font/google";
import SpinnerComponent from "@/app/components/SpinnerComponent";
import { apiGET, apiPOST } from "@/utils/requestWrapper";
import { ITrackedCard } from "@/utils/location";

const auth = getAuth(firebase_app);
const lexend = Lexend({ subsets: ["latin"] });

type AuthContextType = {
  user: User | null;
  theme: string;
  setTheme: (theme: string) => void;
  trackedCards: ITrackedCard[];
  setTrackedCards: (trackedCards: ITrackedCard[]) => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  theme: "slate",
  setTheme: () => {},
  trackedCards: [],
  setTrackedCards: () => {},
});

export const possibleThemes = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  //"red",
  "orange",
  "amber",
  //"yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  //"blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [theme, setTheme] = React.useState<string>("slate");
  const [trackedCards, setTrackedCards] = React.useState<ITrackedCard[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    console.log("Theme changed to", theme);
    // Remove all bg classes
    document
      .querySelector("body")
      ?.classList.remove(...possibleThemes.map((theme) => `bg-${theme}-950`));
    // Add new bg class
    document.querySelector("body")?.classList.add(`bg-${theme}-950`);
  }, [user, theme]);

  const getBackendUser = async (user: User) => {
    apiGET(`/user/${user.uid}`)
      .then((res) => {
        console.log("User found in db");
        console.log(user);
        setTheme(res.theme);
        setTrackedCards(res.tracked_cards);
      })
      .catch((err) => {
        // User missing, create new user in db
        console.log("User missing, creating new user in db");
        apiPOST("/user", {
          fb_id: user.uid,
          theme: "slate",
        })
          .then((res) => {
            console.log(res);
            getBackendUser(user);
          })
          .catch((err) => {
            console.log(
              "Error creating user in db, deleting user in firebase and logging out"
            );
            user.delete();
            auth.signOut();
          });
      });
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        getBackendUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, theme, setTheme, trackedCards, setTrackedCards }}>
      {loading ? (
        <body className={`bg-${theme}-950 ${lexend.className}`}>
          <div className="h-screen flex items-center justify-center">
            <SpinnerComponent />
          </div>
        </body>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
