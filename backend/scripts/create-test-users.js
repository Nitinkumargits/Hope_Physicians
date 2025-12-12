/**
 * Create test users if they don't exist
 * Run: node scripts/create-test-users.js
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function createTestUsers() {
  console.log("🔧 Creating test users...\n");

  const testUsers = [
    {
      email: "admin@hopephysicians.com",
      password: "admin123",
      role: "admin",
    },
    {
      email: "doctor@hopephysicians.com",
      password: "doctor123",
      role: "doctor",
    },
    {
      email: "patient@example.com",
      password: "patient123",
      role: "patient",
    },
    {
      email: "staff@hopephysicians.com",
      password: "staff123",
      role: "staff",
    },
  ];

  for (const userData of testUsers) {
    try {
      // Check if user exists
      const existing = await prisma.portalUser.findUnique({
        where: { email: userData.email },
      });

      if (existing) {
        console.log(`⚠️  User already exists: ${userData.email}`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await prisma.portalUser.create({
        data: {
          email: userData.email,
          passwordHash: passwordHash,
          role: userData.role,
          isActive: true,
          canAccessSystem: true,
        },
      });

      console.log(`✅ Created: ${userData.email} (${userData.role})`);
    } catch (error) {
      console.error(`❌ Error creating ${userData.email}:`, error.message);
    }
  }

  console.log("\n✅ Test users creation completed");
  await prisma.$disconnect();
}

createTestUsers().catch(console.error);
