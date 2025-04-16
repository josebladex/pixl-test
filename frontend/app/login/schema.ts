// app/login/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string()
    .min(6, "The password must be at least 6 characters long")
});


export type LoginFormValues = z.infer<typeof loginSchema>;