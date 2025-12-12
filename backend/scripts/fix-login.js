/**
 * Fix Login Issues - Create/Update Test Users
 * Run: node scripts/fix-login.js
 *
 * This script:
 * 1. Checks if users exist
 * 2. Creates users if missing
 * 3. Updates passwords if hash is wrong
 * 4. Activates accounts if inactive
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function fixLogin() {
  console.log("🔧 Fixing Login Issues...\n");

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
        console.log(`📝 Updating user: ${userData.email}`);

        // Check if password hash is correct
        const isValid = await bcrypt.compare(
          userData.password,
          existing.passwordHash
        );

        if (!isValid) {
          console.log(`   ⚠️  Password hash mismatch, updating...`);
          const newHash = await bcrypt.hash(userData.password, 10);
          await prisma.portalUser.update({
            where: { email: userData.email },
            data: {
              passwordHash: newHash,
              isActive: true,
              canAccessSystem: true,
            },
          });
          console.log(`   ✅ Password updated`);
        } else {
          console.log(`   ✅ Password hash is correct`);
        }

        // Ensure account is active
        if (!existing.isActive || !existing.canAccessSystem) {
          await prisma.portalUser.update({
            where: { email: userData.email },
            data: {
              isActive: true,
              canAccessSystem: true,
            },
          });
          console.log(`   ✅ Account activated`);
        }
      } else {
        console.log(`➕ Creating user: ${userData.email}`);

        // Hash password
        const passwordHash = await bcrypt.hash(userData.password, 10);

        // Try to find related records first
        let employeeId = null;
        let doctorId = null;
        let patientId = null;
        let staffId = null;

        if (
          userData.role === "admin" ||
          userData.role === "doctor" ||
          userData.role === "staff"
        ) {
          const employee = await prisma.employee.findFirst({
            where: { email: userData.email },
          });
          if (employee) employeeId = employee.id;
        }

        if (userData.role === "doctor") {
          const doctor = await prisma.doctor.findFirst({
            where: { email: userData.email },
          });
          if (doctor) doctorId = doctor.id;
        }

        if (userData.role === "patient") {
          const patient = await prisma.patient.findFirst({
            where: { email: userData.email },
          });
          if (patient) patientId = patient.id;
        }

        if (userData.role === "staff") {
          const staff = await prisma.staff.findFirst({
            where: { email: userData.email },
          });
          if (staff) staffId = staff.id;
        }

        // Create user with relationships if found
        await prisma.portalUser.create({
          data: {
            email: userData.email,
            passwordHash: passwordHash,
            role: userData.role,
            isActive: true,
            canAccessSystem: true,
            ...(employeeId && { employeeId }),
            ...(doctorId && { doctorId }),
            ...(patientId && { patientId }),
            ...(staffId && { staffId }),
          },
        });

        console.log(`   ✅ User created`);
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
    console.log("");
  }

  console.log("✅ Login fix completed!\n");

  // Verify users
  console.log("🔍 Verifying users...\n");
  for (const userData of testUsers) {
    const user = await prisma.portalUser.findUnique({
      where: { email: userData.email },
      select: {
        email: true,
        role: true,
        isActive: true,
        canAccessSystem: true,
      },
    });

    if (user) {
      const isValid = await bcrypt.compare(
        userData.password,
        (
          await prisma.portalUser.findUnique({
            where: { email: userData.email },
            select: { passwordHash: true },
          })
        ).passwordHash
      );

      console.log(`${user.email}:`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Active: ${user.isActive}`);
      console.log(`  Can Access: ${user.canAccessSystem}`);
      console.log(`  Password: ${isValid ? "✅ Valid" : "❌ Invalid"}`);
      console.log("");
    }
  }

  await prisma.$disconnect();
}

fixLogin().catch(console.error);
