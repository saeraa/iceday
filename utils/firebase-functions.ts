import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

const loginUser = function (email: string, password: string) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("logging in... ");
    })
    .catch((error) => {
      // TODO: something with errors
      //console.error(error);
    });
};

const logoutUser = function () {
  signOut(auth);
};

const createNewUser = function (email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
};

export { createNewUser, logoutUser, loginUser };
