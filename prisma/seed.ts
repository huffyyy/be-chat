import { RoleType } from "@prisma/client";
import prisma from "../src/utils/prisma";

async function main() {
  const roles: RoleType[] = ["ADMIN", "MEMBER", "OWNER", "USER"];

  for (const role of roles) {
    const roleExist = await prisma.role.findFirst({
      where: { role }
    });

    await prisma.role.upsert({
      where: {
        id: roleExist?.id ?? ""
      },
      create: { role },
      update: {}
    });
  }

  console.log("Success seeding roles");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
