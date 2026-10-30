const Post = require("../models/Post");

exports.getAll = async (req, res) => {
  const posts = await Post.findAll({ order: [["id", "DESC"]] });
  res.json(posts);
};

exports.getOne = async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post);
};

exports.create = async (req, res) => {
  const { title, content } = req.body;

  if (
    typeof title !== "string" || !title.trim() ||
    typeof content !== "string" || !content.trim()
  ) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  const post = await Post.create({
    title: title.trim(),
    content: content.trim(),
    authorId: req.user.id,
  });

  res.status(201).json(post);
};

exports.update = async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const { title, content } = req.body;

  if (
    (title !== undefined &&
      (typeof title !== "string" || !title.trim())) ||
    (content !== undefined &&
      (typeof content !== "string" || !content.trim()))
  ) {
    return res.status(400).json({
      message: "Title and content must be non-empty strings",
    });
  }

  if (title !== undefined) post.title = title.trim();
  if (content !== undefined) post.content = content.trim();

  await post.save();
  res.json(post);
};

exports.remove = async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  await post.destroy();
  res.json({ message: "Post deleted successfully" });
};