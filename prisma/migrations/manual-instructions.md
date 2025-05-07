# Manual Migration Instructions

Since the database connection is not available, follow these steps to update your database schema and migrate existing users:

## Step 1: Run the Prisma migration (when database is accessible)

```bash
npx prisma migrate dev --name add_plan_type
```

## Step 2: Update existing users

After the migration is complete, run the update script to give existing users a plan type:

```bash
# Compile the TypeScript script
npx tsc scripts/update-existing-users.ts --esModuleInterop --outDir dist

# Run the compiled script
node dist/update-existing-users.js
```

## Manual SQL (if needed)

If you prefer to run SQL directly on your database, you can use:

```sql
-- First ensure the enum type exists (created by Prisma migration)
-- Then update all users without a plan type
UPDATE "User"
SET "planType" = 'FREE', "generationsLeft" = 10
WHERE "planType" IS NULL OR "generationsLeft" IS NULL;
```
