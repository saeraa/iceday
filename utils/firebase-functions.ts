import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  GoogleAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
} from "firebase/auth";
import db, { auth } from "@/utils/firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

import { FirebaseError } from "firebase/app";

const handleFirebaseError = (error: FirebaseError | any) => {
  console.error(error);
  if (error instanceof FirebaseError) {
    if (error.code === "auth/wrong-password") {
      return "Wrong password";
    } else if (error.code === "auth/user-not-found") {
      return "User not found";
    } else if (error.code === "auth/email-already-in-use") {
      return "Email already registered, please sign in";
    }
  }
  // handle other error codes if needed

  return "An error occurred";
};

const changeUserEmail = async (email: string) => {
  const currentUser = auth.currentUser;

  if (currentUser && currentUser.email) {
    try {
      await updateEmail(currentUser, email);
      return;
    } catch (error) {
      return handleFirebaseError(error);
    }
  }
};

const deleteAccount = async (password: string): Promise<string> => {
  const currentUser = auth.currentUser;

  if (currentUser && currentUser.email) {
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );

    try {
      await reauthenticateWithCredential(currentUser, credential);

      const docRef = doc(db, "users", currentUser.uid);
      await deleteDoc(docRef);

      await deleteUser(currentUser);
      auth.signOut();
    } catch (error) {
      return handleFirebaseError(error);
    }
  } else {
    // provide error or redirect to login page ?
  }
  return "Account deletion successful";
};

const loginWithGoogle = async (): Promise<boolean> => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential != null) {
      const token = credential.accessToken;
    }

    const userId = result.user.uid;
    const docRef = doc(db, "users", userId);
    const userDoc = await getDoc(docRef);

    if (!userDoc.exists()) {
      addNewUserToDatabase(userId, false);
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const loginUser = async function (email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return handleFirebaseError(error);
  }

  return "";
};

const logoutUser = function () {
  signOut(auth);
};

const addNewUserToDatabase = async function (id: string, alerts: boolean) {
  try {
    const docRef = doc(db, "users", id);
    await setDoc(
      docRef,
      {
        emailAlerts: alerts,
        roles: "user",
      },
      { merge: true }
    );
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

interface AdditionalUserInfo {
  emailAlerts: boolean | null;
  isAdmin: boolean | null;
}

const getAdditionalUserInfo = async function (
  userId: string
): Promise<AdditionalUserInfo> {
  const result = { emailAlerts: false, isAdmin: false };
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (docSnap.data().emailAlerts) {
      result.emailAlerts = docSnap.data().emailAlerts;
      result.isAdmin = docSnap.data().roles == "admin" ? true : false;
      return result;
    }
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  return result;
};

const updateAlertPreferences = async function (
  userId: string,
  alerts: boolean
): Promise<boolean> {
  const userRef = doc(db, "users", userId);

  try {
    await setDoc(
      userRef,
      {
        emailAlerts: alerts,
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error updating alert preferences: ", error);
    return false;
  }
};

const createNewUser = async function (
  email: string,
  password: string,
  alerts: boolean
) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const newUserId = result.user.uid;

    addNewUserToDatabase(newUserId, alerts);
    return "User created successfully";
  } catch (error) {
    return handleFirebaseError(error);
  }
};

const resetPassword = async function (email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    return handleFirebaseError(error);
  }

  return "Password reset email sent successfully";
};

export {
  createNewUser,
  logoutUser,
  loginUser,
  resetPassword,
  loginWithGoogle,
  updateAlertPreferences,
  getAdditionalUserInfo,
  deleteAccount,
  changeUserEmail,
};
