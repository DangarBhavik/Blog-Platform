import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/api/post";

export const useToggleLike = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postService.toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
