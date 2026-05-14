-- AlterTable
ALTER TABLE "User" ADD COLUMN "login" TEXT,
ADD COLUMN "passwordHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateTable
CREATE TABLE "VkAccessCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VkAccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VkAccessCode_code_key" ON "VkAccessCode"("code");

-- CreateIndex
CREATE INDEX "VkAccessCode_expiresAt_idx" ON "VkAccessCode"("expiresAt");
