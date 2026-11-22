import { redirect } from "next/navigation";
import { routes } from "@/shared/config";

// Лендинга пока нет: корень ведёт на главную страницу приложения.
// TODO: заменить на лендинг, авторизованных отправлять на routes.dashboard.
export default function Home() {
  redirect(routes.dashboard);
}
