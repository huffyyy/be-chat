import z from "zod";

export const groupFreeSchema = z.object({
  name: z.string().min(3),
  about: z.string()
});

export const groupPaidSchema = groupFreeSchema.extend({
  price: z.string(),
  benefit: z.array(z.string()).min(1)
});

export type GroupFreeValues = z.infer<typeof groupFreeSchema>;
export type GroupPaidValues = z.infer<typeof groupPaidSchema>;
