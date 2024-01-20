"use client";

import React, { ReactNode, createContext, useEffect, useState } from "react";

import { auth } from "@/utils/firebase";
import { getAdditionalUserInfo } from "@/utils/firebase-functions";
import { onAuthStateChanged } from "firebase/auth";

// undefined: onAuthStateChanged hasn't been called
// null: user is not signed in
// User: user signed in
interface ContextProps {
  user: CustomUser | null | undefined;
  refreshAuthenticationState: () => Promise<void>;
}

const refreshAuthenticationState = async () => {
  console.log("refreshAuthenticationState");
  try {
    await auth.currentUser?.reload();
  } catch (error) {
    console.error("Error refreshing authentication state: ", error);
  }
};

export const AuthContext = createContext<ContextProps>({
  user: undefined,
  refreshAuthenticationState,
});

interface AuthProviderProps {
  children: ReactNode;
}

interface CustomUser {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
  emailAlerts: boolean;
  isAdmin: boolean;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CustomUser | null | undefined>(undefined);
  const [emailAlerts, setEmailAlerts] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        const result = getAdditionalUserInfo(uid).then((userInfo) => {
          if (userInfo.emailAlerts != null && userInfo.isAdmin != null) {
            setUser({
              ...user,
              emailAlerts: userInfo.emailAlerts,
              isAdmin: userInfo.isAdmin,
            });
          }
        });
        // ...
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Update emailAlerts state when user.emailAlerts changes
    if (user?.emailAlerts !== undefined) {
      setEmailAlerts(user.emailAlerts);
    }
  }, [user?.emailAlerts]);

  return (
    <AuthContext.Provider value={{ user, refreshAuthenticationState }}>
      {children}
    </AuthContext.Provider>
  );
};
