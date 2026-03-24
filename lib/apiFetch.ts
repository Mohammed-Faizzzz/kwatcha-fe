export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    if (res.status === 429) {
      throw new ApiError(
        "Too many requests — you've hit the rate limit. Please wait a moment and try again.",
        429
      );
    }
    if (res.status >= 500) {
      throw new ApiError(
        "The server encountered an error. Please try again shortly.",
        res.status
      );
    }
    const data = await res.json().catch(() => null);
    throw new ApiError(
      data?.message || data?.error || `Request failed (${res.status})`,
      res.status
    );
  }
  return res.json() as Promise<T>;
}
