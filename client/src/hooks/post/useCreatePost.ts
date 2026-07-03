
import { useMutation } from "@tanstack/react-query";
import { postService } from "@/services/api/post";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: postService.createPost,
  });
};