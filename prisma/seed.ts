import { PrismaClient } from "@prisma/client"
import crypto from "node:crypto"
import bcrypt from "bcryptjs"
import { seedStarterTemplates } from "../lib/starter-templates"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create demo user
  const passwordHash = await bcrypt.hash("demo1234", 12)
  const user = await prisma.user.upsert({
    where: { email: "demo@rendr.dev" },
    update: {},
    create: {
      email: "demo@rendr.dev",
      passwordHash,
    },
  })

  console.log(`Demo user: ${user.email}`)

  // Create a demo API key
  const rawKey = `rk_live_${crypto.randomBytes(32).toString("base64url")}`
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex")
  const keyPrefix = rawKey.slice(0, 16)

  const existing = await prisma.apiKey.findFirst({
    where: { userId: user.id, name: "Demo Key" },
  })

  if (!existing) {
    await prisma.apiKey.create({
      data: {
        userId: user.id,
        name: "Demo Key",
        keyPrefix,
        keyHash,
      },
    })
    console.log(`Demo API key created (prefix: ${keyPrefix}...)`)
    console.log(`Full key (save this!): ${rawKey}`)
  } else {
    console.log("Demo key already exists, skipping.")
  }

  // Seed starter templates for demo user
  await seedStarterTemplates(user.id, prisma)
  console.log("Starter templates seeded.")

  console.log("Seed complete.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
