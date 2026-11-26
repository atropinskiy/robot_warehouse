export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  warehouses: "/warehouses",
  dispatch: "/dispatch",
  mapEditor: "/map-editor",
  tasks: "/tasks",
  history: "/history",
  members: "/members",
  assistant: "/assistant",
  settings: "/settings",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
