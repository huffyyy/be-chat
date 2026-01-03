/*
  Warnings:

  - A unique constraint covering the columns `[room_id,user_id]` on the table `room_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "room_members_room_id_user_id_key" ON "room_members"("room_id", "user_id");
