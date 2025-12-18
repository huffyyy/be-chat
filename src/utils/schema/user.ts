import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true
});

export type signUpValues = z.infer<typeof signUpSchema>;
export type signInValues = z.infer<typeof signInSchema>;
