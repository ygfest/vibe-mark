# Plan Type Migration Guide

This guide will help you update your database to add plan types and generations limits to user accounts.

## Step 1: Run the migration

The Prisma schema has been updated to include the new fields. Run the migration to update your database schema:

```bash
npm run migrate-plan-type
```

This will create the necessary columns in your database.

## Step 2: Update existing users

After running the migration, you need to update existing user accounts to have the FREE plan type and 10 generations. Run:

```bash
npm run update-users
```

This script will find all users without a plan type and set them to the FREE plan with 10 generations remaining.

## Manual update (if needed)

If you need to manually update your database, you can use the following SQL:

```sql
UPDATE "User"
SET "planType" = 'FREE', "generationsLeft" = 10
WHERE "planType" IS NULL OR "generationsLeft" IS NULL;
```

## Troubleshooting

If you encounter issues with the migration:

1. Make sure your database is accessible
2. Check that the Prisma schema has been properly updated
3. Review the migration logs for any errors
4. If needed, run the SQL manually using your database management tool
