import { Response } from "express";
import ApiError from "../utils/api-error";
import apiResponse from "../utils/api-response";
import { generateSlug } from "../utils/slug";
import { prisma } from "../prisma/client";
import {
  createPost as createPostRepo,
  CreatePostDto,
  getPosts as getPostsRepo,
  getPostById as getPostByIdRepo,
  createComment as createCommentRepo,
  toggleLike as toggleLikeRepo,
  getPostsByAuthor as getPostsByAuthorRepo,
  deletePostById as deletePostByIdRepo,
} from "../services/repositories/post";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { AuthenticatedRequest } from "../types/index";

export const createPost = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const {
      title,
      content,
      excerpt,
      tags,
      published,
    } = req.body;

    const userId = req.user?.id;
    
    // Parse published field to proper boolean
    const isPublished = published === true || published === "true";

    // Robust parsing of tags from tags and tags[] fields
    let normalizedTags: string[] = [];
    if (Array.isArray(tags)) {
      normalizedTags = tags;
    } else if (typeof tags === "string" && tags.trim()) {
      normalizedTags = [tags.trim()];
    } else if (req.body["tags[]"]) {
      const tagsArray = req.body["tags[]"];
      if (Array.isArray(tagsArray)) {
        normalizedTags = tagsArray;
      } else if (typeof tagsArray === "string" && tagsArray.trim()) {
        normalizedTags = [tagsArray.trim()];
      }
    }

    if (!title || !content) {
      const error = new ApiError(400, "Title and content are required");
      return res.status(error.statusCode).json(error);
    }

    const slug = generateSlug(title);

    let coverImage = "";

    // Handle image upload to Cloudinary if file is provided
    if (req.file) {
      try {
        const uploadResult = await uploadImageToCloudinary(
          req.file.buffer,
          `${slug}-${Date.now()}`,
          "blog/cover-images"
        );
        coverImage = uploadResult.secure_url;
      } catch (uploadError) {
        const error = new ApiError(
          400,
          uploadError instanceof Error ? uploadError.message : "Image upload failed"
        );
        return res.status(error.statusCode).json(error);
      }
    }

    const post = await createPostRepo({
      title,
      content,
      excerpt,
      coverImage,
      tags: normalizedTags,
      published: isPublished,
      authorId: userId,
      slug,
    } as CreatePostDto);

    const response = new apiResponse(201, "Post created successfully", post);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }

    const apiError = new ApiError(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const getPostsList = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const posts = await getPostsRepo();
    const response = new apiResponse(200, "Posts fetched successfully", posts);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    const apiError = new ApiError(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const getPostDetail = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id as string;
    const post = await getPostByIdRepo(id);

    if (!post) {
      const error = new ApiError(404, "Post not found");
      return res.status(error.statusCode).json(error);
    }

    // Fetch related posts (up to 3) based on tag overlap
    let relatedPosts: any[] = [];
    if (post.tags && post.tags.length > 0) {
      relatedPosts = await prisma.post.findMany({
        where: {
          id: { not: id },
          published: true,
          tags: { hasSome: post.tags },
        },
        take: 3,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });
    }

    // Fallback to recent posts if tag matches are less than 3
    if (relatedPosts.length < 3) {
      const extraPosts = await prisma.post.findMany({
        where: {
          id: { not: id },
          published: true,
          NOT: {
            id: { in: [id, ...relatedPosts.map((p) => p.id)] }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 3 - relatedPosts.length,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });
      relatedPosts = [...relatedPosts, ...extraPosts];
    }

    const response = new apiResponse(200, "Post details fetched successfully", {
      post,
      relatedPosts,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    const apiError = new ApiError(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const addComment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id as string;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      const error = new ApiError(401, "Unauthorized");
      return res.status(error.statusCode).json(error);
    }

    if (!content || !content.trim()) {
      const error = new ApiError(400, "Comment content cannot be empty");
      return res.status(error.statusCode).json(error);
    }

    const comment = await createCommentRepo(id, userId, content.trim());
    const response = new apiResponse(201, "Comment added successfully", comment);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    const apiError = new ApiError(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const togglePostLike = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
      const error = new ApiError(401, "Unauthorized");
      return res.status(error.statusCode).json(error);
    }

    await toggleLikeRepo(id, userId);

    // Check if the like record now exists to respond with true/false
    const likeRecord = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });

    const response = new apiResponse(
      200,
      likeRecord ? "Post liked successfully" : "Post unliked successfully",
      { liked: !!likeRecord }
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    const apiError = new ApiError(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const getMyPostsList = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      const error = new ApiError(401, "Unauthorized");
      return res.status(error.statusCode).json(error);
    }

    const posts = await getPostsByAuthorRepo(userId);
    const response = new apiResponse(200, "My posts fetched successfully", posts);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    const apiError = new ApiError(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
    return res.status(apiError.statusCode).json(apiError);
  }
};

export const deleteUserPost = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
      const error = new ApiError(401, "Unauthorized");
      return res.status(error.statusCode).json(error);
    }

    // Verify post exists and belongs to the user
    const post = await getPostByIdRepo(id);
    if (!post) {
      const error = new ApiError(404, "Post not found");
      return res.status(error.statusCode).json(error);
    }

    if (post.authorId !== userId) {
      const error = new ApiError(403, "You do not have permission to delete this post");
      return res.status(error.statusCode).json(error);
    }

    await deletePostByIdRepo(id, userId);

    const response = new apiResponse(200, "Post deleted successfully", null);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    const apiError = new ApiError(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
    return res.status(apiError.statusCode).json(apiError);
  }
};
