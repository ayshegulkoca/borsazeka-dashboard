import { auth } from "@/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

/**
 * POST /api/auth/refresh → { token, refreshToken }
 * Sonsuz Uzatma (Sliding Expiration): her iki token da yenilenir
 */
async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  if (!API_BASE_URL) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[apiFetch] Token refresh failed (${response.status}):`, body);
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.token;
    const newRefreshToken = data.refreshToken;

    if (!newAccessToken || !newRefreshToken) {
      console.error("[apiFetch] Refresh response missing token fields");
      return null;
    }

    console.info("[apiFetch] Token refreshed successfully");
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error("[apiFetch] Refresh request network error:", error);
    return null;
  }
}

/**
 * Merkezi API fetch fonksiyonu
 * - Bearer token otomatik eklenir
 * - 401 hatası → otomatik refresh → retry (Bölüm 3: Token Refresh akışı)
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await auth();
  let accessToken = session?.user?.accessToken;
  const refreshToken = session?.user?.refreshToken;

  // Backend Team Instruction: API returns 404 if token is missing.
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Kesinlikle HTTP kullanılması talimatı (http://api.borsazeka.com:5072/api)
  const baseUrl = API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // ─── 401 Retry Logic (Bölüm 3: Token Refresh) ─────────────────
  // 401 hatası → POST /api/auth/refresh → yeni tokenlar → retry
  if (response.status === 401 && refreshToken) {
    console.warn("[apiFetch] 401 received — attempting token refresh...");

    const refreshed = await refreshAccessToken(refreshToken);

    if (refreshed) {
      // Yeni token ile başarısız olan isteği tekrarla (retry)
      const retryHeaders = new Headers(options.headers);
      retryHeaders.set("Authorization", `Bearer ${refreshed.accessToken}`);
      if (!retryHeaders.has("Content-Type")) {
        retryHeaders.set("Content-Type", "application/json");
      }

      console.info("[apiFetch] Retrying original request with new token...");
      const retryResponse = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });

      return retryResponse;
    } else {
      console.error("[apiFetch] Token refresh failed, returning original 401 response");
    }
  }

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

/**
 * BorsaZeka dispatch (MyRobots) API'sinden kullanıcının sahip olduğu robotları (abonelikleri) çeker.
 */
export async function getMyRobots(email: string): Promise<any[]> {
  try {
    const response = await apiFetch("/dispatch", {
      method: "POST",
      body: JSON.stringify({
        mail: email,
        isNotification: false,
        method: "MyRobots",
        data: {},
      }),
    });
    if (response.ok) {
      const json = await response.json().catch(() => null);
      if (json?.success && json?.data?.robots) {
        return json.data.robots;
      }
    }
  } catch (error) {
    console.error("Error fetching MyRobots:", error);
  }
  return [];
}

