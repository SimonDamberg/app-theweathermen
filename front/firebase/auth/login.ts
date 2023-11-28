import { apiPOST } from "@/utils/requestWrapper";
import firebase_app from "../config";
import {
  signInWithEmailAndPassword,
  getAuth,
  signInAnonymously,
} from "firebase/auth";

const auth = getAuth(firebase_app);

export const logIn = async (email: string, password: string) => {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
};

export const anonymousLogin = async () => {
  let result = null,
    error = null;
  try {
    result = await signInAnonymously(auth);
    if (result.user) {
      apiPOST("/user", {
        fb_id: result.user.uid,
        theme: "slate",
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);

          // delete user in firebase
          result!.user?.delete();

          // log out user
          auth.signOut();
        });
    }
  } catch (e) {
    error = e;
  }

  return { result, error };
};
