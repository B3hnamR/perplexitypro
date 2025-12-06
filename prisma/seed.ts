import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Create Admin
  const email = 'br.1515@yahoo.com'
  const password = 'y53Rop=J9b5~$XOeT82Os2%J5P!4jt0'
  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Super Admin',
    },
  })

  // 2. Create Default Product (Fix for "Product not found" error)
  await prisma.product.create({
    data: {
      name: "Perplexity Pro Subscription",
      description: "دسترسی به هوش مصنوعی‌های GPT-4, Claude 3 و...",
      price: 398000,
      imageUrl: "/perplexity-pro-logo.png"
    }
  });

  console.log("Seed completed!")
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })