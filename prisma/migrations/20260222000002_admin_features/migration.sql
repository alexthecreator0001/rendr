-- Add bannedAt to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bannedAt" TIMESTAMP(3);

-- SupportTicket
CREATE TABLE IF NOT EXISTS "SupportTicket" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "subject"   TEXT NOT NULL,
  "message"   TEXT NOT NULL,
  "status"    TEXT NOT NULL DEFAULT 'open',
  "priority"  TEXT NOT NULL DEFAULT 'normal',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "SupportTicket"
  ADD CONSTRAINT "SupportTicket_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- FeatureRequest
CREATE TABLE IF NOT EXISTS "FeatureRequest" (
  "id"          TEXT NOT NULL,
  "userId"      TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status"      TEXT NOT NULL DEFAULT 'submitted',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "FeatureRequest"
  ADD CONSTRAINT "FeatureRequest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- FeatureVote
CREATE TABLE IF NOT EXISTS "FeatureVote" (
  "id"               TEXT NOT NULL,
  "userId"           TEXT NOT NULL,
  "featureRequestId" TEXT NOT NULL,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FeatureVote_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "FeatureVote"
  ADD CONSTRAINT "FeatureVote_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FeatureVote"
  ADD CONSTRAINT "FeatureVote_featureRequestId_fkey"
  FOREIGN KEY ("featureRequestId") REFERENCES "FeatureRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FeatureVote"
  ADD CONSTRAINT "FeatureVote_userId_featureRequestId_key"
  UNIQUE ("userId", "featureRequestId");
