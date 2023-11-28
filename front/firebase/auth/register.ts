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
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      updateProfile(result.user, {
        displayName: name,
      });

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

export default registerPasswordEmail;
