/*
  Warnings:

  - A unique constraint covering the columns `[callId]` on the table `call_logs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `callId` to the `call_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `call_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `visitors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."call_logs" DROP CONSTRAINT "call_logs_botId_fkey";

-- AlterTable
ALTER TABLE "public"."call_logs" ADD COLUMN     "callId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "duration" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'completed';

-- AlterTable
ALTER TABLE "public"."employees" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."visitors" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "call_logs_callId_key" ON "public"."call_logs"("callId");

-- CreateIndex
CREATE INDEX "call_logs_callId_idx" ON "public"."call_logs"("callId");

-- CreateIndex
CREATE INDEX "call_logs_botId_idx" ON "public"."call_logs"("botId");

-- CreateIndex
CREATE INDEX "call_logs_createdAt_idx" ON "public"."call_logs"("createdAt");

-- CreateIndex
CREATE INDEX "employees_name_idx" ON "public"."employees"("name");

-- CreateIndex
CREATE INDEX "visitors_phoneNumber_idx" ON "public"."visitors"("phoneNumber");

-- AddForeignKey
ALTER TABLE "public"."call_logs" ADD CONSTRAINT "call_logs_botId_fkey" FOREIGN KEY ("botId") REFERENCES "public"."bots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
