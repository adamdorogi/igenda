const express = require("express");
const postController = require("../controllers/post-controller");

const router = express.Router();

router.post("/posts", postController.postPost);
router.get("/posts/:id", postController.getPost);
router.get("/posts", postController.getPosts);
router.delete("/posts/:id", postController.deletePost);

module.exports = { router };
