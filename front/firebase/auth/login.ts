import { apiPOST } from "@/utils/requestWrapper";
import firebase_app from "../config";
import {
  signInWithEmailAndPassword,
  getAuth,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const auth = getAuth(firebase_app);

/**
 * @description - This function is used to sign in with email and password.
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns - A promise that resolves to the user if successful, or rejects if not
 */
export const logIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
      return Promise.resolve(res.user);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

/**
 * @description - This function is used to sign in anonymously.
 * @returns - A promise that resolves to the user if successful, or rejects if not
 */
export const anonymousLogin = async () => {
  return signInAnonymously(auth)
    .then((res) => {
      return Promise.resolve(res.user);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

/**
 * @description - This function is used to sign in with Google.
 * @returns - A promise that resolves to the user if successful, or rejects if not
 */
export const googleLogin = async () => {
  const googleProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleProvider)
    .then((res) => {
      return Promise.resolve(res.user);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
