import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
} from "firebase/auth";
import db, { auth } from "@/utils/firebase";
import {
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, setDoc } from "firebase/firestore";

const changeEmail = (email: string) => {
  // do something
};

const deleteUserFromAuthAndDatabase = async (
  password: string
): Promise<string> => {
  let message = "";
  const currentUser = auth.currentUser;

  if (currentUser && currentUser.email) {
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );

    await reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        deleteUser(currentUser)
          .then(() => {
            // also delete from database
          })
          .catch((error) => {});
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          if (error.code == "auth/wrong-password") {
            message = "Wrong password";
            return message;
          } else if (error.code == "auth/user-not-found") {
            message = "User not found";
            return message;
          }
        }
        // An error ocurred
        // ...
      });
  } else {
    // provide error or redirect to login page ?
  }
  return message;
};

const signInWithGoogle = async (): Promise<boolean> => {
  let response = false;
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential != null) {
        const token = credential.accessToken;
      }
      // The signed-in user.
      const userId = result.user.uid;

      // query database if user already exists
      // if not exists, add to database
      const docRef = doc(db, "users", userId);
      getDoc(docRef).then((ref) => {
        if (!ref.exists()) {
          addNewUserToDatabase(userId, false);
        }
      });

      response = true;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      console.error(error);
      /* 
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ... */
      response = false;
    });

  return response;
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
  let result = false;
  const userRef = doc(db, "users", userId);

  await setDoc(
    userRef,
    {
      emailAlerts: alerts,
    },
    { merge: true }
  )
    .then(() => {
      result = true;
    })
    .catch((err) => {
      result = false;
    });

  return result;
};

const createNewUser = async function (
  email: string,
  password: string,
  alerts: boolean
) {
  let message = "";

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const newUserId = result.user.uid;

    addNewUserToDatabase(newUserId, alerts);
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
  updateAlertPreferences,
  getAdditionalUserInfo,
  deleteUserFromAuthAndDatabase,
};
