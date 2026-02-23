-- Add Stripe billing fields to User
ALTER TABLE "User" ADD COLUMN "stripeCustomerId"     TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN "stripeSubscriptionId" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN "stripePriceId"        TEXT;
ALTER TABLE "User" ADD COLUMN "subscriptionStatus"   TEXT;
