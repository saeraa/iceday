"use client";
import React, { useEffect, useState, createContext, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { getAlertPreferences } from "@/utils/firebase-functions";

// undefined: onAuthStateChanged hasn't been called
// null: user is not signed in
// User: user signed in
interface ContextProps {
  user: CustomUser | null | undefined;
  refreshAuthenticationState: () => Promise<void>;
}

const refreshAuthenticationState = async () => {
  try {
    const currentUser = await auth.currentUser?.reload();
  } catch (error) {
    console.error("Error refreshing authentication state:", error);
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
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CustomUser | null | undefined>(undefined);
  const [emailAlerts, setEmailAlerts] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("auth state changed");
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        const result = getAlertPreferences(uid).then((alertPreferences) => {
          setUser({
            ...user,
            emailAlerts: alertPreferences,
          });
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
