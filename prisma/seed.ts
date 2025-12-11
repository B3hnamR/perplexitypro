import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // دریافت اطلاعات از متغیرهای محیطی برای امنیت بیشتر
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("❌ ADMIN_PASSWORD is missing in .env file.");
    process.exit(1);
  }

  // 1. Create Admin
  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.admin.upsert({
    where: { email },
    update: {
        password: hashedPassword, // آپدیت پسورد در صورت تغییر در env
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Super Admin',
    },
  })

  // 2. Create Default Product (Fix for "Product not found" error)
  const product = await prisma.product.findFirst();
  if (!product) {
      await prisma.product.create({
        data: {
          name: "Perplexity Pro Subscription",
          description: "دسترسی به هوش مصنوعی‌های GPT-5, Claude 3 و...",
          price: 398000,
          imageUrl: "/perplexity-pro-logo.png"
        }
      });
  }

  console.log("Seed completed successfully!")
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })