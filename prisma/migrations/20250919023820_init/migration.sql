-- CreateTable
CREATE TABLE "public"."bots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visitors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "appointment" TEXT NOT NULL,
    "expectedEmployee" TEXT NOT NULL,
    "phoneNumber" TEXT,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."call_logs" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "visitor" TEXT NOT NULL,
    "employee" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "transcript" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bots_uid_key" ON "public"."bots"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_phoneNumber_key" ON "public"."visitors"("phoneNumber");

-- AddForeignKey
ALTER TABLE "public"."call_logs" ADD CONSTRAINT "call_logs_botId_fkey" FOREIGN KEY ("botId") REFERENCES "public"."bots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
