import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
});

export type signUpValues = z.infer<typeof signUpSchema>;
