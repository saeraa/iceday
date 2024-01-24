import { ZodSchema, z } from "zod";

const PASSWORD_REGEX = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
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
  .min(2, { message: "Name is required" })
  .max(100, { message: "Name must not be longer than 100 characters." });

const abbreviation = z
  .string({
    required_error: "Abbreviation is required",
    invalid_type_error: "Abbreviation must be a string",
  })
  .trim()
  .min(2, { message: "Abbreviation is required" })
  .max(5, { message: "Abbreviations must not be longer than 5 letters." });

const teamIcon = z
  .any()
  .refine((file: File) => file !== null, "File is required")
  .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    ".jpg, .jpeg, .png and .webp files are accepted."
  );

const city = z.string().trim().min(2, { message: "City is required" });

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

interface TeamErrorObject {
  name: { success: boolean; error: string };
  abbreviation: { success: boolean; error: string };
  city: { success: boolean; error: string };
  file: { success: boolean; error: string };
}

interface TeamObject {
  name: string | undefined;
  abbreviation: string | undefined;
  league: string | undefined;
  city: string | undefined;
  file: File | null;
}

function validateTeam(input: TeamObject): TeamErrorObject {
  return {
    name: parseInput(input.name, name),
    abbreviation: parseInput(input.abbreviation, abbreviation),
    city: parseInput(input.city, city),
    file: parseInput(input.file, teamIcon),
  };
}

interface LoginErrorObject {
  email: { success: boolean; error: string };
  password: { success: boolean; error: string };
}

interface LoginObject {
  email: string | undefined;
  password: string | undefined;
}

function validateLogin(input: LoginObject): LoginErrorObject {
  return {
    email: parseInput(input.email, email),
    password: parseInput(input.password, password),
  };
}

interface RegisterErrorObject {
  email: { success: boolean; error: string };
  passwordOne: { success: boolean; error: string };
  passwordTwo: { success: boolean; error: string };
}

interface RegisterObject {
  email: string | undefined;
  passwordOne: string | undefined;
  passwordTwo: string | undefined;
}

function validateRegister(input: RegisterObject): RegisterErrorObject {
  return {
    email: parseInput(input.email, email),
    passwordOne: parseInput(input.passwordOne, password),
    passwordTwo: parseInput(input.passwordOne, passwordForm, input.passwordTwo),
  };
}

function parseInput(input: any, schema: ZodSchema, secondInput?: string) {
  let validationResult: z.SafeParseReturnType<any, any>;
  if (secondInput) {
    validationResult = schema.safeParse({
      password: input,
      confirm: secondInput,
    });
  } else {
    validationResult = schema.safeParse(input);
  }
  const result = {
    success: true,
    error: "",
  };
  if (!validationResult.success) {
    result.success = false;
    result.error = validationResult.error.errors[0].message;
  }
  return result;
}

export { validateTeam, validateLogin, validateRegister };
