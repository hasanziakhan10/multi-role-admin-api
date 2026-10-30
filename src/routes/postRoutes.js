const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const posts = require("../controllers/postController");

router.get("/", authenticate, authorize("admin", "editor", "viewer"), posts.getAll);
router.get("/:id", authenticate, authorize("admin", "editor", "viewer"), posts.getOne);

router.post("/", authenticate, authorize("admin", "editor"), posts.create);
router.put("/:id", authenticate, authorize("admin", "editor"), posts.update);
router.delete("/:id", authenticate, authorize("admin"), posts.remove);

module.exports = router;