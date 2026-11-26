"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/shared/api";
import { routes } from "@/shared/config";
import { useSessionStore } from "@/entities/session";
import { Button, HStack, Text } from "@/shared/ui";

export function UserMenu() {
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const clear = useSessionStore((s) => s.clear);

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clear();
      router.replace(routes.login);
    },
  });

  return (
    <HStack align="center" gap="sm">
      <Text variant="caption" tone="muted" className="hidden sm:block">
        {user?.name}
      </Text>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Выходим…" : "Выйти"}
      </Button>
    </HStack>
  );
}
