require("dotenv").config();

const express = require("express");
const sequelize = require("./config/db");

const User = require("./models/User");
const Post = require("./models/Post");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.message);

  if (res.headersSent) return next(err);

  res.status(500).json({ message: "Internal server error" });
});

async function initializeDatabase() {
  await sequelize.authenticate();

  User.hasMany(Post, {
    foreignKey: "authorId",
    onDelete: "RESTRICT",
  });

  Post.belongsTo(User, { foreignKey: "authorId" });

  await sequelize.sync();
}
const authenticate = require("./middleware/auth");

app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({
    message: `Welcome ${req.user.role}`,
    user: req.user
  });
});

module.exports = { app, initializeDatabase };