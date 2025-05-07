import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateExistingUsers() {
  try {
    console.log(
      "Starting migration: Adding plan information to existing users..."
    );

    // For PostgreSQL, we need to execute a raw SQL query since Prisma's
    // type safety prevents us from updating fields that aren't yet in the client
    const result = await prisma.$executeRaw`
      UPDATE "User" 
      SET "planType" = 'FREE', "generationsLeft" = 10 
      WHERE "planType" IS NULL OR "generationsLeft" IS NULL
    `;

    console.log(
      `Migration completed: Users updated with FREE plan and 10 generations`
    );
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
updateExistingUsers();
