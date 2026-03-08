-- Google Sheets integration tables

CREATE TABLE "GoogleConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "scopes" TEXT[],
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "GoogleConnection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SheetSync" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "spreadsheetId" TEXT NOT NULL,
    "spreadsheetName" TEXT NOT NULL,
    "sheetName" TEXT NOT NULL,
    "columnMapping" JSONB NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "lastRunStatus" TEXT,
    "lastRunJobCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SheetSync_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BatchRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sheetSyncId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'running',
    "totalJobs" INTEGER NOT NULL,
    "succeededJobs" INTEGER NOT NULL DEFAULT 0,
    "failedJobs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "BatchRun_pkey" PRIMARY KEY ("id")
);

-- Add batchRunId to Job
ALTER TABLE "Job" ADD COLUMN "batchRunId" TEXT;

-- Indexes
CREATE UNIQUE INDEX "GoogleConnection_userId_email_key" ON "GoogleConnection"("userId", "email");
CREATE INDEX "SheetSync_userId_idx" ON "SheetSync"("userId");
CREATE INDEX "BatchRun_userId_createdAt_idx" ON "BatchRun"("userId", "createdAt" DESC);
CREATE INDEX "Job_batchRunId_idx" ON "Job"("batchRunId");

-- Foreign keys
ALTER TABLE "GoogleConnection" ADD CONSTRAINT "GoogleConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SheetSync" ADD CONSTRAINT "SheetSync_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SheetSync" ADD CONSTRAINT "SheetSync_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "GoogleConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SheetSync" ADD CONSTRAINT "SheetSync_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BatchRun" ADD CONSTRAINT "BatchRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BatchRun" ADD CONSTRAINT "BatchRun_sheetSyncId_fkey" FOREIGN KEY ("sheetSyncId") REFERENCES "SheetSync"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Job" ADD CONSTRAINT "Job_batchRunId_fkey" FOREIGN KEY ("batchRunId") REFERENCES "BatchRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
