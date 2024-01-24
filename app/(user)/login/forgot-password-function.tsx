"use server";

import { AlertColor } from "@mui/material";
import { resetPassword } from "@/utils/firebase-account";

export default async function (
  prevState: {
    message: string;
    status: AlertColor;
    errors: string;
  },
  formData: FormData
): Promise<{
  message: string;
  status: AlertColor;
  errors: string;
}> {
  const email = formData.get("email")?.toString().trim();

  if (email != undefined && email.length > 5) {
    const result = await resetPassword(email);

    if (result == "Password reset email sent successfully") {
      return Promise.resolve({
        message: "success",
        status: "success",
        errors: "Password reset sent, check your email",
      });
    } else {
      return Promise.resolve({
        message: "error",
        status: "error",
        errors: result,
      });
    }
  } else {
    return Promise.resolve({
      message: "error",
      status: "error",
      errors: "Please enter an email",
    });
  }
}
