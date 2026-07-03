import { authService } from "@/services/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useLogout() {
    const  queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn : authService.logout,

        onSuccess : () => {
            queryClient.invalidateQueries({
                queryKey : ['current-user']
            })
            router.push('/');
        }
    })
}