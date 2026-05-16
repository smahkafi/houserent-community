import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

const seedUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = [
      {
        fullName: "Super Admin",
        phone: "01700000001",
        email: null,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        isActive: true,
        isApproved: true,
      },
      {
        fullName: "Admin User",
        phone: "01700000002",
        email: null,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
        isApproved: true,
      },
      {
        fullName: "Landlord User",
        phone: "01700000003",
        email: null,
        password: hashedPassword,
        role: "LANDLORD",
        isActive: true,
        isApproved: true,
      },
      {
        fullName: "Tenant User",
        phone: "01700000004",
        email: null,
        password: hashedPassword,
        role: "TENANT",
        isActive: true,
        isApproved: true,
      },
      {
        fullName: "Resident User",
        phone: "01700000005",
        email: null,
        password: hashedPassword,
        role: "RESIDENT",
        isActive: true,
        isApproved: true,
      },
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: {
          phone: user.phone,
        },
        update: user,
        create: user,
      });
    }

    console.log("Test users seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed users:", error.message);
    process.exit(1);
  }
};

seedUsers();