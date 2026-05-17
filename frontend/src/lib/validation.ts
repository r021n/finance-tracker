import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "email is required" })
    .min(1, { error: "email is required" })
    .pipe(z.email({ error: "invalid email format" })),
  password: z
    .string({ error: "password is required" })
    .min(1, { error: "password is required" }),
});

export const registerSchema = z
  .object({
    name: z
      .string({ error: "name is required" })
      .min(1, { error: "name is required" })
      .min(3, { error: "name must be at least 3 characters" }),
    email: z
      .string({ error: "email is required" })
      .min(1, { error: "email is required" })
      .pipe(z.email({ error: "invalid email format" })),
    password: z
      .string({ error: "password is required" })
      .min(1, { error: "password is required" })
      .min(6, { error: "password must be at least 6 characters" }),
    confirmPassword: z
      .string({ error: "confirm password is required" })
      .min(1, "confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "password do not match",
    path: ["confirmPassword"],
  });

export const transactionSchema = z.object({
  category_id: z
    .number({ error: "category is required" })
    .int()
    .min(1, { error: "category is required" }),

  type: z.enum(["income", "expense"], {
    error: "type must be income or expense",
  }),

  amount: z
    .number({ error: "error must be a number" })
    .min(1, { error: "amount must be greater than 0" }),

  note: z
    .string()
    .max(500, { error: "note must be at most 500 characters" })
    .optional()
    .default(""),

  date: z.string("date is required").min(1, { error: "date is required" }),
});

export const categorySchema = z.object({
  name: z
    .string("name is required")
    .min(1, { error: "name is required" })
    .min(1, { error: "name must be at least 2 characters" })
    .max(100, { error: "name must be at most 100 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type categoryFormData = z.infer<typeof categorySchema>;
