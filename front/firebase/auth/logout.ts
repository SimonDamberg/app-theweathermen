import firebase_app from "../config";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebase_app);

export const logOutUser = async () => {
  return signOut(auth)
    .then(() => {
      return Promise.resolve(true);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
