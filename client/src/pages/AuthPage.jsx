import { useState } from "react";
import api from "../api/api";

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const endpoint =
        mode === "register" ? "/auth/register" : "/auth/login";

      const data =
        mode === "register"
          ? { name, email, password }
          : { email, password };

      const response = await api.post(endpoint, data);

      localStorage.setItem(
        "endangered_species_token",
        response.data.token
      );

      onLogin(response.data.token);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Authentication failed. Please try again."
      );
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">SECURE ACCESS</p>
        <h2>
          {mode === "register" ? "Create Account" : "Welcome Back"}
        </h2>
        <p>
          {mode === "register"
            ? "Register to access the Endangered Species Tracker."
            : "Sign in to access your protected species dashboard."}
        </p>
      </div>

      <form className="species-form" onSubmit={handleSubmit}>
        {mode === "register" && (
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 characters"
            minLength="6"
            required
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">
          {mode === "register" ? "Create Account" : "Sign In"}
        </button>

        <button
          type="button"
          className="auth-switch"
          onClick={switchMode}
        >
          {mode === "register"
            ? "Already have an account? Sign In"
            : "Need an account? Register"}
        </button>
      </form>
    </main>
  );
}

export default AuthPage;
