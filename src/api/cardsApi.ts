import { API_BASE_URL } from "../config";
import type { Card, CardInput } from "../types";

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      // El API Gateway valida este header contra el Authorizer de Cognito
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Error ${response.status} ${response.statusText}${body ? ` — ${body}` : ""}`,
    );
  }

  // DELETE responde 204 sin cuerpo
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function fetchCards(token: string): Promise<Card[]> {
  return request<Card[]>("/api/cards", token, { method: "GET" });
}

export function createCard(token: string, data: CardInput): Promise<Card> {
  return request<Card>("/api/cards", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCard(
  token: string,
  id: string,
  data: CardInput,
): Promise<Card> {
  return request<Card>(`/api/cards/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteCard(token: string, id: string): Promise<void> {
  return request<void>(`/api/cards/${id}`, token, { method: "DELETE" });
}
