import { AlertColor } from "@mui/material";
import { loginUser } from "@/utils/firebase-account";
import { validateLogin } from "@/utils/validation";

interface ErrorObject {
  email: { success: boolean; error: string };
  password: { success: boolean; error: string };
}

export default async function (
  prevState: {
    message: string;
    status: AlertColor;
    errors: ErrorObject | null;
  },
  formData: FormData
): Promise<{
  message: string;
  status: AlertColor;
  errors: ErrorObject | null;
}> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString().trim();

  const formDataToValidate = {
    email: email ?? "",
    password: password ?? "",
  };

  const validationResult = validateLogin(formDataToValidate);

  const keys = Object.keys(validationResult) as Array<
    keyof typeof validationResult
  >;

  let error = false;

  keys.forEach((key) => {
    if (validationResult[key].success == false) {
      error = true;
    }
  });

  if (error) {
    return { message: "", status: "error", errors: validationResult };
  } else {
    if (email && password) {
      const result = await loginUser(email, password);

      if (result && result.length > 0) {
        return Promise.resolve({
          message: "Success!",
          status: "success",
          errors: null,
        });
      } else if (result == "User not found") {
        return Promise.resolve({
          message: "Success!",
          status: "success",
          errors: {
            email: { success: false, error: result },
            password: { success: true, error: "" },
          },
        });
      }
      return {
        message: "Success!",
        status: "success",
        errors: null,
      };
    }

    return Promise.resolve({
      message: "Success!",
      status: "success",
      errors: null,
    });
  }
}
