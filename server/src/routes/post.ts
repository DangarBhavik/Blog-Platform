import express from "express";
import {
  createPost,
  getPostsList,
  getPostDetail,
  addComment,
  togglePostLike,
  getMyPostsList,
  deleteUserPost,
} from "../controllers/postController";
import { authenticate, optionalAuthenticate } from "../middlewares/auth";
import upload from "../middlewares/multer";

const router = express.Router();

router.post("/create-post", authenticate, upload.single("coverImage"), createPost);
router.get("/posts", getPostsList);
router.get("/my-posts", authenticate, getMyPostsList);
router.get("/posts/:id", optionalAuthenticate, getPostDetail);
router.post("/posts/:id/comment", authenticate, addComment);
router.post("/posts/:id/like", authenticate, togglePostLike);
router.delete("/posts/:id", authenticate, deleteUserPost);

export default router;