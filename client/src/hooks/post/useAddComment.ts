import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/api/post";

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => postService.addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
};
