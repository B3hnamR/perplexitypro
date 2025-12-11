import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    console.error("ADMIN_EMAIL is missing in environment variables.");
    process.exit(1);
  }

  if (!password) {
    console.error("ADMIN_PASSWORD is missing in environment variables.");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Super Admin',
    },
  });

  const product = await prisma.product.findFirst();
  if (!product) {
    await prisma.product.create({
      data: {
        name: "Perplexity Pro Subscription",
        description: "Access to Perplexity Pro and premium LLM models.",
        price: 398000,
        imageUrl: "/perplexity-pro-logo.png"
      }
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
