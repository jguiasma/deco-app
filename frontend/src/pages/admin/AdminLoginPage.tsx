import { useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../services/api";

export function AdminLoginPage({ onAuthenticated }: { onAuthenticated: (token: string) => void }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch(`${apiUrl}/login`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(credentials) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.errors?.email?.[0] ?? "Identifiants administrateur invalides.");
      onAuthenticated(data.token);
    } catch (loginError) { setError(loginError instanceof Error ? loginError.message : "Connexion impossible."); } finally { setLoading(false); }
  };
  return <main className="bwd-admin-page"><section className="bwd-admin-login"><p className="bwd-eyebrow">Espace professionnel</p><h1>Connexion admin</h1><p>Accédez aux demandes, rendez-vous, devis et projets.</p><form className="bwd-admin-form" onSubmit={login}><label>E-mail<input type="email" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} required /></label><label>Mot de passe<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required /></label>{error && <p className="bwd-admin-error">{error}</p>}<button className="bwd-dark-button" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</button><Link to="/">← Retour au site</Link></form></section></main>;
}
