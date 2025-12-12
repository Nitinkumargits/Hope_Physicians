/**
 * Test Login Endpoint Directly
 * Run: node scripts/test-login.js
 *
 * This tests the login endpoint with various credentials
 * to diagnose authentication issues
 */

const axios = require("axios");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const API_URL = process.env.API_URL || "http://localhost:5000/api";

async function testLogin() {
  console.log("🔍 Testing Login Endpoint...\n");
  console.log(`API URL: ${API_URL}\n`);

  // Test credentials
  const testCredentials = [
    { email: "admin@hopephysicians.com", password: "admin123", role: "admin" },
    {
      email: "doctor@hopephysicians.com",
      password: "doctor123",
      role: "doctor",
    },
    { email: "patient@example.com", password: "patient123", role: "patient" },
    { email: "staff@hopephysicians.com", password: "staff123", role: "staff" },
  ];

  // First, check if users exist in database
  console.log("📊 Checking database for users...\n");
  for (const cred of testCredentials) {
    try {
      const user = await prisma.portalUser.findUnique({
        where: { email: cred.email },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          canAccessSystem: true,
          passwordHash: true,
        },
      });

      if (user) {
        console.log(`✅ User found: ${cred.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Can Access: ${user.canAccessSystem}`);

        // Test password hash
        const isValid = await bcrypt.compare(cred.password, user.passwordHash);
        console.log(`   Password match: ${isValid ? "✅" : "❌"}`);

        if (!isValid) {
          console.log(`   ⚠️  Password hash mismatch!`);
          console.log(`   Expected password: ${cred.password}`);
        }
        console.log("");
      } else {
        console.log(`❌ User NOT found: ${cred.email}\n`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${cred.email}:`, error.message);
    }
  }

  // Now test login endpoint
  console.log("\n🔐 Testing Login Endpoint...\n");
  for (const cred of testCredentials) {
    try {
      console.log(`Testing: ${cred.email}...`);
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: cred.email,
          password: cred.password,
          role: cred.role,
        },
        {
          timeout: 5000,
          validateStatus: () => true, // Don't throw on any status
        }
      );

      if (response.status === 200 && response.data.token) {
        console.log(`   ✅ Login successful!`);
        console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
        console.log(`   User: ${response.data.user?.email || "N/A"}`);
      } else {
        console.log(`   ❌ Login failed: ${response.status}`);
        console.log(`   Error: ${response.data?.error || "Unknown error"}`);
      }
      console.log("");
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data?.error || "Unknown"}`);
      }
      console.log("");
    }
  }

  await prisma.$disconnect();
}

testLogin().catch(console.error);
