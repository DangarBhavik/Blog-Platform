import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/api/post";

export const usePostDetail = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPostDetail(id),
    enabled: !!id,
  });
};
