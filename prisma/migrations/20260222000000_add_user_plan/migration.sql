-- AlterTable: add plan field to User with default 'starter'
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "plan" TEXT NOT NULL DEFAULT 'starter';

-- Upgrade test account to pro plan (applied once; no-op if user doesn't exist)
UPDATE "User" SET "plan" = 'pro' WHERE "email" = 'test@test.sk';
