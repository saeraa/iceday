import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const loginUser = async function (email: string, password: string) {
  let message = "";

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code == "auth/wrong-password") {
        return "Wrong password";
      } else if (error.code == "auth/user-not-found") {
        return "Email address not found";
      }
    }
  }

  return message;
};

const logoutUser = function () {
  signOut(auth);
};

const createNewUser = function (email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
};

export { createNewUser, logoutUser, loginUser };
