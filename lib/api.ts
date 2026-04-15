import { auth } from "@/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await auth();
  const token = session?.user?.accessToken;

  // Backend Team Instruction: API returns 404 if token is missing.
  // We should ideally check for token existence here for non-public endpoints.
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Kesinlikle HTTP kullanılması talimatı (http://api.borsazeka.com:5072/api)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Kullanıcı bilgilerini veya diğer verileri çekmek için kolaylaştırılmış GET isteği
 */
export async function apiGet<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await apiFetch(endpoint, { method: "GET" });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`API Get Error (${endpoint}):`, error);
    return null;
  }
}

/**
 * Veri göndermek için kolaylaştırılmış POST isteği
 */
export async function apiPost<T>(endpoint: string, body: any): Promise<T | null> {
  try {
    const response = await apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`API Post Error (${endpoint}):`, error);
    return null;
  }
}
