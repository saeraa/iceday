import { z } from "zod";

//const z = require("zod"); // line for testing rules in the console, to be removed!

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const password = z.string().trim().regex(PASSWORD_REGEX, {
  message:
    "Passwords need to be at least 8 characters long, with at least one number and one letter.",
});

const email = z.string().trim().email({ message: "Invalid email address" });

const name = z
  .string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  })
  .trim()
  .max(100, { message: "Name must not be longer than 100 characters." });

const abbreviation = z
  .string({
    required_error: "Abbreviation is required",
    invalid_type_error: "Abbreviation must be a string",
  })
  .trim()
  .max(5, { message: "Abbreviations must not be longer than 5 letters." });

const teamIcon = z
  .any()
  .refine((files) => files?.length == 1, "Image is required.")
  .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    ".jpg, .jpeg, .png and .webp files are accepted."
  );

const teamForm = z.object({
  name: name,
  abbreviation: abbreviation,
  city: z.string().trim(),
  icon: teamIcon,
});

const loginForm = z.object({
  email: email,
  password: password,
});

const passwordForm = z
  .object({
    password: password,
    confirm: password,
  })
  .refine(
    (data: { password: string; confirm: string }) =>
      data.password === data.confirm,
    {
      message: "Passwords don't match",
    }
  );

const registerForm = z.object({
  email: email,
  passwordForm,
  emailAlerts: z.boolean(),
});

/* const teamInput = {
  name: "Rögle BK",
  abbreviation: "RBK",
  city: "Ängelholm",
  icon: null,
};

teamForm.parse(teamInput); */

export default function validate(type: string, input: {}) {
  switch (type) {
    case "login":
      return loginForm.safeParse(input);
    case "team":
      return teamForm.safeParse(input);
    case "register":
      return registerForm.safeParse(input);
    default:
      return { success: false, error: "type not found" };
  }
}
