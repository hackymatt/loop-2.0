import { z as zod } from "zod";

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
  password: zod
    .string()
    .min(1, { message: "Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" }),
});

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod
  .object({
    email: zod
      .string()
      .min(1, { message: "Adres e-mail jest wymagany." })
      .email({ message: "Adres e-mail jest niepoprawny." }),
    password: zod
      .string()
      .min(1, { message: "Hasło jest wymagane." })
      .min(6, { message: `Hasło musi mieć minimum ${6} znaków` })
      .regex(/[A-Z]/, { message: "Hasło musi zawierać minimum jedną dużą literę." })
      .regex(/[a-z]/, { message: "Hasło musi zawierać minimum jedną małą literę." })
      .regex(/[0-9]/, { message: "Hasło musi zawierać minimum jedną cyfrę." })
      .regex(/[!@#$%^&]/, {
        message: "Hasło musi zawierać minimum jeden znak specjalny (!@#$%^&).",
      }),
    confirmPassword: zod.string().min(1, { message: "Hasło jest wymagane." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same.",
    path: ["confirmPassword"],
  });

// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
});

// ----------------------------------------------------------------------

export type UpdatePasswordSchemaType = zod.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordSchema = zod
  .object({
    code: zod
      .string()
      .min(1, { message: "Code is required!" })
      .min(6, { message: "Code must be at least 6 characters!" }),
    email: zod
      .string()
      .min(1, { message: "Email is required!" })
      .email({ message: "Email must be a valid email address!" }),
    password: zod
      .string()
      .min(1, { message: "Password is required!" })
      .min(6, { message: "Password must be at least 6 characters!" }),
    confirmPassword: zod.string().min(1, { message: "Confirm password is required!" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

// ----------------------------------------------------------------------

export type VerifySchemaType = zod.infer<typeof VerifySchema>;

export const VerifySchema = zod.object({
  code: zod
    .string()
    .min(1, { message: "Code is required!" })
    .min(6, { message: "Code must be at least 6 characters!" }),
});
