import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "email is required" })
    .pipe(z.email({ error: "invalid email format" })),
  password: z
    .string({ error: "password is required" })
    .min(1, { error: "password is required" }),
});

export const registerSchema = z
  .object({
    name: z
      .string({ error: "name is required" })
      .min(3, { error: "name must be at least 3 characters" }),
    email: z
      .string({ error: "email is required" })
      .pipe(z.email({ error: "invalid email format" })),
    password: z
      .string({ error: "password is required" })
      .min(6, { error: "password must be at least 6 characters" }),
    confirmPassword: z.string({ error: "confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "password do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
