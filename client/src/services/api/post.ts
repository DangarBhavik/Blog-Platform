// services/api/post.ts

import { api } from "@/lib/axios-instance";
import { CreatePostPayload } from "@/types/post";

export const postService = {
  createPost: async (payload: CreatePostPayload | FormData) => {
    const formData = payload instanceof FormData ? payload : new FormData();

    if (!(payload instanceof FormData)) {
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      formData.append("published", String(payload.published ?? false));

      if (payload.coverImageFile) {
        formData.append("coverImage", payload.coverImageFile);
      }

      payload.tags.forEach((tag) => {
        formData.append("tags", tag);
      });
    }

    const response = await api.post("/api/create-post", formData);

    return response.data;
  },

  getPosts: async () => {
    const response = await api.get("/api/posts");
    return response.data.data;
  },

  getPostDetail: async (id: string) => {
    const response = await api.get(`/api/posts/${id}`);
    return response.data.data;
  },

  addComment: async (postId: string, content: string) => {
    const response = await api.post(`/api/posts/${postId}/comment`, { content });
    return response.data.data;
  },

  toggleLike: async (postId: string) => {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data.data;
  },

  getMyPosts: async () => {
    const response = await api.get("/api/my-posts");
    return response.data.data;
  },

  deletePost: async (postId: string) => {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data.data;
  },
};