import type { User } from "./types";

// TODO: брать текущего пользователя из сессии после внедрения авторизации (F4.3).
export const mockCurrentUser: User = {
  id: "operator",
  name: "Оператор",
  email: "operator@example.com",
};
