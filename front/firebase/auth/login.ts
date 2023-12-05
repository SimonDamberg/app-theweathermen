import { apiPOST } from "@/utils/requestWrapper";
import firebase_app from "../config";
import {
  signInWithEmailAndPassword,
  getAuth,
  signInAnonymously,
} from "firebase/auth";

const auth = getAuth(firebase_app);

export const logIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
      return Promise.resolve(res.user);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const anonymousLogin = async () => {
  return signInAnonymously(auth)
    .then((res) => {
      return Promise.resolve(res.user);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
