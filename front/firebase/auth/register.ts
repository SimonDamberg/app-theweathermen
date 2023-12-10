import { apiPOST } from "@/utils/requestWrapper";
import firebase_app from "../config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";

const auth = getAuth(firebase_app);

const registerPasswordEmail = async (
  name: string,
  email: string,
  password: string
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((res) => {
      if (res.user) {
        return updateProfile(res.user, {
          displayName: name,
        })
          .then(() => {
            return Promise.resolve(res.user);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export default registerPasswordEmail;
