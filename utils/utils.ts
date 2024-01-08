//import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from ".././firebase";

export const LoginUser = (email: string, password: string) => {
  const router = useRouter();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // console.log("User >>", user);
      router.push("/dashboard");
    })
    .catch((error) => {
      console.error(error);
    });
};
