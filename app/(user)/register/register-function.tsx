import { AlertColor } from "@mui/material";
import { createNewUser } from "@/utils/firebase-account";
import { validateRegister } from "@/utils/validation";

interface ErrorObject {
  email: { success: boolean; error: string };
  passwordOne: { success: boolean; error: string };
  passwordTwo: { success: boolean; error: string };
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
  const passwordOne = formData.get("passwordOne")?.toString().trim();
  const passwordTwo = formData.get("passwordTwo")?.toString().trim();
  const emailAlerts = formData.get("emailAlerts")?.toString();

  const formDataToValidate = {
    email: email ?? "",
    passwordOne: passwordOne ?? "",
    passwordTwo: passwordTwo ?? "",
  };

  const validationResult = validateRegister(formDataToValidate);

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
    if (email && passwordOne && passwordTwo) {
      const optInToEmailAlerts = emailAlerts ? true : false;
      const result = await createNewUser(
        email,
        passwordOne,
        optInToEmailAlerts
      );

      if (result && result == "User created successfully") {
        return Promise.resolve({
          message: "Success!",
          status: "success",
          errors: null,
        });
      } else if (result == "Email already registered, please sign in") {
        return Promise.resolve({
          message: "Email already registered, please sign in",
          status: "warning",
          errors: null,
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
