-- Google OAuth login: make passwordHash optional, add googleId + image

ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;
ALTER TABLE "User" ADD COLUMN "image" TEXT;
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
