"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { login } from "@/shared/api";
import { routes } from "@/shared/config";
import { useSessionStore } from "@/entities/session";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Text,
} from "@/shared/ui";

const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(1, "Пароль обязателен"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useSessionStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      router.replace(routes.dashboard);
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Вход</CardTitle>
        <CardDescription>Войдите в аккаунт Robot Warehouse</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="user@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email && (
              <Text tone="danger" variant="caption">
                {errors.email.message}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password && (
              <Text tone="danger" variant="caption">
                {errors.password.message}
              </Text>
            )}
          </div>

          {mutation.isError && (
            <Text tone="danger" variant="caption">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Не удалось войти"}
            </Text>
          )}

          <Button type="submit" disabled={mutation.isPending} className="mt-1">
            {mutation.isPending ? "Входим…" : "Войти"}
          </Button>
        </form>

        <Text tone="muted" variant="caption" className="mt-4">
          Нет аккаунта?{" "}
          <Link
            href={routes.register}
            className="text-primary underline-offset-4 hover:underline"
          >
            Зарегистрироваться
          </Link>
        </Text>
      </CardContent>
    </Card>
  );
}
