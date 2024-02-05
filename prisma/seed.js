// seeds.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      { name: "User1", email: "user1@example.com" },
      { name: "User2", email: "user2@example.com" },
      // Add more data as needed
    ],
  });
}

seed()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
