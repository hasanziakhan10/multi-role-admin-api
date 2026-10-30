const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.use(authenticate, authorize("admin"));

router.get("/users", async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role", "createdAt"],
  });

  res.json(users);
});

router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  const allowedRoles = ["admin", "editor", "viewer"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Role must be admin, editor or viewer",
    });
  }

  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.id === req.user.id && role !== "admin") {
    return res.status(400).json({
      message: "You cannot remove your own admin role",
    });
  }

  user.role = role;
  await user.save();

  res.json({
    message: "User role updated successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = router;