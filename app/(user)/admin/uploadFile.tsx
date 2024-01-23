"use server";

import { AlertColor } from "@mui/material";
import { addTeam } from "@/utils/firebase-database";
import { validateTeam } from "@/utils/validation";

interface FormDataToUpload {
  name: string;
  abbreviation: string;
  city: string;
  icon: File | null;
}

interface ErrorObject {
  name: { success: string; error: string };
  abbreviation: { success: string; error: string };
  city: { success: string; error: string };
  file: { success: string; error: string };
}

export default async function upload(
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
  "use server";

  // check if file
  const file: File | null = formData.get("file") as unknown as File;
  const name = formData.get("name")?.toString();
  const abbreviation = formData.get("abbreviation")?.toString();
  const league = formData.get("league")?.toString();
  const city = formData.get("city")?.toString();
  console.log(file);

  const formDataToValidate = {
    name,
    abbreviation,
    league,
    city,
    file,
  };

  const validationResult = validateTeam(formDataToValidate);
  console.log(validationResult);

  const keys = Object.keys(validationResult) as Array<
    keyof typeof validationResult
  >;

  let error = false;

  keys.forEach((key) => {
    if (validationResult[key].success == "false") {
      error = true;
    }
  });

  if (error) {
    return { message: "", status: "error", errors: validationResult };
  } else {
    if (name && abbreviation && city) {
      if (!file) {
        const formData: FormDataToUpload = {
          name: name,
          abbreviation: abbreviation,
          city: city,
          icon: null,
        };
        addTeam(formData);
        return {
          message: "Success!",
          status: "success",
          errors: null,
        };
      } else {
        const formData: FormDataToUpload = {
          name: name,
          abbreviation: abbreviation,
          city: city,
          icon: file,
        };
        addTeam(formData);
        return {
          message: "Success!",
          status: "success",
          errors: null,
        };
      }
    }
  }
  return { message: "", status: "success", errors: null };
}
