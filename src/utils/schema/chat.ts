import z from "zod";

export const createRoomPersonalSchema = z
  .object({
    user_id: z.string()
  })
  .strict();

export type createRoomPersonalValues = z.infer<typeof createRoomPersonalSchema>;
