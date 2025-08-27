import.meta.env.VITE_API_BASE ??
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://notes-app-production-90ed.up.railway.app");

export default async function api(path, { token, method = "GET", body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? null : res.json();
}