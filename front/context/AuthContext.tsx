"use client";
import React from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { useTranslation } from "react-i18next";
import NavbarComponent from "@/app/components/NavbarComponent";
import { Lexend } from "next/font/google";
import SpinnerComponent from "@/app/components/SpinnerComponent";

const auth = getAuth(firebase_app);
const lexend = Lexend({ subsets: ["latin"] });

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <body className={`bg-slate-950 ${lexend.className}`}>
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
