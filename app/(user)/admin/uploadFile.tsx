"use server";

import { AlertColor } from "@mui/material";
import { addTeam } from "@/utils/firebase-database";

interface FormDataToUpload {
  name: string;
  abbreviation: string;
  city: string;
  icon: File | null;
}

export default async function upload(
  prevState: {
    message: string;
    status: AlertColor;
  },
  formData: FormData
): Promise<{ message: string; status: AlertColor }> {
  "use server";

  console.log("add team form submitted");
  console.log(formData);

  // check if file
  const file: File | null = formData.get("file") as unknown as File;
  const name = formData.get("name")?.toString();
  const abbreviation = formData.get("abbreviation")?.toString();
  const city = formData.get("city")?.toString();

  if (name && abbreviation && city) {
    if (name.length == 0 || abbreviation.length == 0 || city.length == 0) {
      return { message: "Missing some entries", status: "error" };
    } else {
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
        };
      } else {
        const formData: FormDataToUpload = {
          name: name,
          abbreviation: abbreviation,
          city: city,
          icon: file,
        };
        addTeam(formData);
        return { message: "Success!", status: "success" };
      }
    }
  }
  return { message: "Something went wrong", status: "error" };
}
