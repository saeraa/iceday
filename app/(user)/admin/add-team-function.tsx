import { AlertColor } from "@mui/material";
import { addTeam } from "@/utils/firebase-database";
import { isCurrentUserAdmin } from "@/utils/firebase-account";
import { validateTeam } from "@/utils/validation";

interface FormDataToUpload {
  name: string;
  abbreviation: string;
  city: string;
  league: string;
  file: File | null;
}

interface ErrorObject {
  name: { success: boolean; error: string };
  abbreviation: { success: boolean; error: string };
  city: { success: boolean; error: string };
  file: { success: boolean; error: string };
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
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return {
      message: "Only admins can add data to the database",
      status: "error",
      errors: null,
    };
  }

  // check if file
  const file: File | null = formData.get("file") as unknown as File;
  const name = formData.get("name")?.toString();
  const abbreviation = formData.get("abbreviation")?.toString();
  const league = formData.get("league")?.toString();
  const city = formData.get("city")?.toString();

  const formDataToValidate: FormDataToUpload = {
    name: name ?? "",
    abbreviation: abbreviation ?? "",
    league: league ?? "",
    city: city ?? "",
    file: file.size === 0 ? null : file,
  };

  const validationResult = validateTeam(formDataToValidate);

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
    if (name && abbreviation && city && league) {
      if (!file) {
        const formData: FormDataToUpload = {
          name: name,
          abbreviation: abbreviation,
          city: city,
          league: league,
          file: null,
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
          league: league,
          file: file,
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
