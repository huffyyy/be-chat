import z from "zod";

export const createRoomPersonalSchema = z
  .object({
    user_id: z.string()
  })
  .strict();

export const createMessageSchema = z.object({
  message: z.string(),
  room_id: z.string()
});

export type createRoomPersonalValues = z.infer<typeof createRoomPersonalSchema>;
export type createMessageValues = z.infer<typeof createMessageSchema>;
