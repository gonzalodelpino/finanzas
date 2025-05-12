"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Asegúrate de que esta ruta sea correcta

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos vacíos
    if (!email || !password) {
      setError("Por favor, ingresa tu correo electrónico y contraseña.");
      return;
    }

    // Validar formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirige tras login exitoso
    } catch (error: any) {
      console.error("Error de Firebase:", error);

      switch (error.code) {
        case "auth/invalid-email":
          setError("El correo electrónico ingresado no es válido.");
          break;
        case "auth/user-not-found":
          setError("No se encontró una cuenta con este correo electrónico.");
          break;
        case "auth/wrong-password":
          setError("La contraseña ingresada es incorrecta.");
          break;
        case "auth/too-many-requests":
          setError("Demasiados intentos fallidos. Intenta más tarde.");
          break;
        default:
          setError("Hubo un error al intentar iniciar sesión. Intenta nuevamente.");
      }
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin} style={{ marginTop: "1rem" }}>
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
          />
        </div>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            marginTop: "1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

