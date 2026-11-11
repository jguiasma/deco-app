/** Adresse unique de l'API Laravel, configurable dans VITE_API_URL. */
export const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost/api").replace(/\/$/, "");

export async function readApiError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null) as { message?: string; errors?: Record<string, string[]> } | null;
  if (data?.errors) return Object.values(data.errors).flat().join(" ");
  return data?.message ?? fallback;
}
