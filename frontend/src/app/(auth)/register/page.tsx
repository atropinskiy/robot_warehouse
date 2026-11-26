"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { register as registerUser } from "@/shared/api";
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

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Имя должно содержать минимум 2 символа")
      .max(100, "Имя слишком длинное"),
    email: z.string().email("Некорректный email"),
    password: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .max(72, "Пароль слишком длинный")
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
        "Пароль должен содержать цифру, заглавную и строчную буквы и спецсимвол (@$!%*?&)",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useSessionStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: ({ name, email, password }: RegisterFormValues) =>
      registerUser({ name, email, password }),
    onSuccess: (user) => {
      setUser(user);
      router.replace(routes.dashboard);
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Регистрация</CardTitle>
        <CardDescription>Создайте аккаунт Robot Warehouse</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Иван"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name && (
              <Text tone="danger" variant="caption">
                {errors.name.message}
              </Text>
            )}
          </div>

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
              autoComplete="new-password"
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Повторите пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <Text tone="danger" variant="caption">
                {errors.confirmPassword.message}
              </Text>
            )}
          </div>

          {mutation.isError && (
            <Text tone="danger" variant="caption">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Не удалось зарегистрироваться"}
            </Text>
          )}

          <Button type="submit" disabled={mutation.isPending} className="mt-1">
            {mutation.isPending ? "Создаём аккаунт…" : "Зарегистрироваться"}
          </Button>
        </form>

        <Text tone="muted" variant="caption" className="mt-4">
          Уже есть аккаунт?{" "}
          <Link
            href={routes.login}
            className="text-primary underline-offset-4 hover:underline"
          >
            Войти
          </Link>
        </Text>
      </CardContent>
    </Card>
  );
}
