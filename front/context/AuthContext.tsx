"use client";
import React from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { useTranslation } from "react-i18next";
import { Lexend } from "next/font/google";
import SpinnerComponent from "@/app/components/SpinnerComponent";
import { apiGET } from "@/utils/requestWrapper";
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

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user);
        apiGET(`/user/${user.uid}`).then((res) => {
          console.log(res.tracked_cards);
          if (res) {
            setTheme(res.theme);
            setTrackedCards(res.tracked_cards);
          }
        });
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
