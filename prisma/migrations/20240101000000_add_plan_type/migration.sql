-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PLUS', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planType" "PlanType" NOT NULL DEFAULT 'FREE',
                     ADD COLUMN     "generationsLeft" INTEGER NOT NULL DEFAULT 10; 