import api from "@/services/api";

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function logIn(body: {
  email: string;
  password: string;
}): Promise<{ user: { id: string; email: string }; token: string }> {
  const { data } = await api.post("/auth/login", body);

  return {
    user: data.user,
    token: data.token,
  };
}

export function logOut() {
  return api.delete("/auth/me");
}

export function forgotPassword(body: { email: string }) {
  return api.post("/auth/forgot-password", body);
}

export function resetPassword(body: { token: string; password: string }) {
  return api.post("/auth/reset-password", body);
}

export function createAccount(body: { email: string; password: string }) {
  return api.post("/auth/register", body);
}

export function activateAccount(body: { token: string }) {
  return api.post("/auth/register/activate", body);
}
