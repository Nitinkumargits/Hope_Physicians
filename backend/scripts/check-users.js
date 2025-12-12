/**
 * Check if test users exist in database
 * Run: node scripts/check-users.js
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUsers() {
  console.log("🔍 Checking test users in database...\n");

  const testUsers = [
    { email: "admin@hopephysicians.com", role: "admin" },
    { email: "doctor@hopephysicians.com", role: "doctor" },
    { email: "patient@example.com", role: "patient" },
    { email: "staff@hopephysicians.com", role: "staff" },
  ];

  for (const testUser of testUsers) {
    try {
      const user = await prisma.portalUser.findUnique({
        where: { email: testUser.email },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          canAccessSystem: true,
        },
      });

      if (user) {
        console.log(`✅ ${testUser.role}: ${user.email}`);
        console.log(
          `   Active: ${user.isActive}, Can Access: ${user.canAccessSystem}\n`
        );
      } else {
        console.log(`❌ ${testUser.role}: ${testUser.email} - NOT FOUND\n`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${testUser.email}:`, error.message);
    }
  }

  // Check total users
  const totalUsers = await prisma.portalUser.count();
  console.log(`\n📊 Total users in database: ${totalUsers}`);

  await prisma.$disconnect();
}

checkUsers().catch(console.error);
