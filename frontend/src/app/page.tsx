import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/shared/config";

// Лендинга пока нет: корень ведёт на дашборд (авторизованных) или на вход.
// Кука httpOnly, поэтому читаем её на сервере. Если access-токен истёк,
// клиентский SessionProvider всё равно уведёт на /login.
export default async function Home() {
  const cookieStore = await cookies();
  const hasAccessToken = cookieStore.has("access_token");
  redirect(hasAccessToken ? routes.dashboard : routes.login);
}
