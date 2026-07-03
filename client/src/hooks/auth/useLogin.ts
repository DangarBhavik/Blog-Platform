"use client";

import { authService } from "@/services/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useLogin() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn : authService.login,

        onSuccess : () => {
            queryClient.invalidateQueries({
                queryKey : ["current-user"]
            })
            router.push('/');
        }
    })
}