"use client";
import React, { useEffect, useState, createContext, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";

// undefined: onAuthStateChanged hasn't been called
// null: user is not signed in
// User: user signed in
interface ContextProps {
  user: User | null | undefined;
}

export const AuthContext = createContext<ContextProps>({ user: undefined });

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setUser(user);
        // ...
      } else {
        setUser(null);
        // User is signed out
        // ...
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
