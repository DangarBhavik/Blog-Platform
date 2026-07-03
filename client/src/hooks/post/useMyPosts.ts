import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/api/post";

export const useMyPosts = () => {
  return useQuery({
    queryKey: ["my-posts"],
    queryFn: postService.getMyPosts,
  });
};
