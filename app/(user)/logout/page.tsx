"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function Page() {
  signOut(auth);
  const router = useRouter();
  router.push("/");
  return (
    <main>
      <div>Logging you out .... Redirecting</div>
    </main>
  );
}
