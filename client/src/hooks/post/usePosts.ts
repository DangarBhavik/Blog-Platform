import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/api/post";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: postService.getPosts,
  });
};
