import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as crypto from "crypto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
  return { salt, hash };
}

async function main() {
  // Seed roles
  await prisma.role.upsert({ where: { roleName: "Admin" }, update: {}, create: { roleId: 1, roleName: "Admin" } });
  await prisma.role.upsert({ where: { roleName: "Officer" }, update: {}, create: { roleId: 2, roleName: "Officer" } });
  await prisma.role.upsert({ where: { roleName: "Citizen" }, update: {}, create: { roleId: 3, roleName: "Citizen" } });

  console.log("✅ Roles seeded");

  // Seed demo Admin user
  const { salt, hash } = hashPassword("Admin@1234");

  await prisma.user.upsert({
    where: { email: "admin@govtech.local" },
    update: {},
    create: {
      name: "Demo Admin",
      email: "admin@govtech.local",
      mobile: "9999999999",
      salt,
      passwordHash: hash,
      roleId: 1,
    },
  });

  console.log("✅ Admin user seeded");
  console.log("   Email: admin@govtech.local");
  console.log("   Password: Admin@1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());