import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/utils/firebase";
import {
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential != null) {
        const token = credential.accessToken;
      }
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

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

const createNewUser = async function (email: string, password: string) {
  let message = "";

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code == "auth/email-already-in-use") {
        return "Email already registered, please sign in";
      }
    }
  }

  return message;
};

const resetPassword = async function (email: string) {
  let message = "";

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    if (error instanceof FirebaseError) {
      return error.code;
    }
  }

  return message;
};

export {
  createNewUser,
  logoutUser,
  loginUser,
  resetPassword,
  signInWithGoogle,
};
