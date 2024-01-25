import { AlertColor } from "@mui/material";
import { addGame } from "@/utils/firebase-database";
import dayjs from "dayjs";
import { isCurrentUserAdmin } from "@/utils/firebase-account";
import { validateAddGameForm } from "@/utils/validation";

interface ErrorObject {
  homeTeam: { success: boolean; error: string };
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

  const date = formData.get("date")?.toString();
  const league = formData.get("league")?.toString();
  const time = formData.get("time")?.toString();
  const homeTeam = formData.get("hometeam")?.toString();
  const awayTeam = formData.get("awayteam")?.toString();

  const formDataToValidate = {
    homeTeam: homeTeam ?? "",
    awayTeam: awayTeam ?? "",
  };

  const validationResult = validateAddGameForm(formDataToValidate);

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
    if (homeTeam && awayTeam && date && time && league) {
      const composedDateTime = dayjs(date + time, "DD/MM/YYYY HH:mm");

      const formData = {
        homeTeam,
        awayTeam,
        dateTime: composedDateTime,
        league,
      };
      await addGame(formData);

      return {
        message: "Success!",
        status: "success",
        errors: null,
      };
    }
  }

  return {
    message: "All fields need to be filled in",
    status: "error",
    errors: null,
  };
}
