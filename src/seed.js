require("dotenv").config();

const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const User = require("./models/User");

const demoUsers = [
  {
    name: "Demo Admin",
    email: "admin@example.com",
    password: "AdminDemo123!",
    role: "admin",
  },
  {
    name: "Demo Editor",
    email: "editor@example.com",
    password: "EditorDemo123!",
    role: "editor",
  },
  {
    name: "Demo Viewer",
    email: "viewer@example.com",
    password: "ViewerDemo123!",
    role: "viewer",
  },
];

async function seed() {
  try {
    await sequelize.authenticate();

    for (const demo of demoUsers) {
      const passwordHash = await bcrypt.hash(demo.password, 12);

      await User.findOrCreate({
        where: { email: demo.email },
        defaults: {
          name: demo.name,
          password: passwordHash,
          role: demo.role,
        },
      });
    }

    console.log("Demo users created or already exist.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();