import { z } from "zod";

export const RegisterSchema = z.object({
  email: z
    .string()
    .email()
    .max(255)
    .transform((s) => s.toLowerCase().trim()),
  password: z
    .string()
    .min(10, "Minimum 10 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .transform((s) => s.toLowerCase().trim()),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(10)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(10)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1),
});
