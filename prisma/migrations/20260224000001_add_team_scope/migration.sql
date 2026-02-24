-- Add teamId to ApiKey
ALTER TABLE "ApiKey" ADD COLUMN "teamId" TEXT;
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add teamId to Job
ALTER TABLE "Job" ADD COLUMN "teamId" TEXT;
ALTER TABLE "Job" ADD CONSTRAINT "Job_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Job_teamId_createdAt_idx" ON "Job" ("teamId", "createdAt" DESC);

-- Add teamId to Webhook
ALTER TABLE "Webhook" ADD COLUMN "teamId" TEXT;
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add teamId to UsageEvent
ALTER TABLE "UsageEvent" ADD COLUMN "teamId" TEXT;
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "UsageEvent_teamId_createdAt_idx" ON "UsageEvent" ("teamId", "createdAt" DESC);
