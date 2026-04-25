import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set.");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const EMAIL    = "admin@everwood.ma";
const PASSWORD = "0RrNZVU7L74G6g!A9";   // change after first login
const ROLE     = "admin";

async function main() {
  // 1. Upsert admin role
  const role = await prisma.role.upsert({
    where:  { name: ROLE },
    update: {},
    create: { name: ROLE, description: "Full administrative access" },
  });

  // 2. Check if admin user already exists
  const existing = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (existing) {
    console.log(`ℹ️   User ${EMAIL} already exists — skipping creation.`);
    await prisma.$disconnect();
    return;
  }

  // 3. Hash password (12 rounds)
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  // 4. Create user (pre-verified so login works immediately)
  const user = await prisma.user.create({
    data: {
      email:         EMAIL,
      passwordHash,
      emailVerified: true,
    },
  });

  // 5. Assign admin role
  await prisma.userRole.create({
    data: { userId: user.id, roleId: role.id },
  });

  console.log("✅  Admin user created successfully.");
  console.log("────────────────────────────────────");
  console.log(`   Email    : ${EMAIL}`);
  console.log(`   Password : ${PASSWORD}`);
  console.log(`   Role     : ${ROLE}`);
  console.log("────────────────────────────────────");
  console.log("⚠️   Change this password after first login.");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
