'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa ambos campos.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setError('Error al iniciar sesión. Revisa tus credenciales.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg-login.jpg')" }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/bank-logo-icon-illustration-vector.png"
            alt="Logo del banco"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">Banco Aurora</h1>
          <p className="text-gray-500 text-sm mt-1">Accede a tu banca online</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-800 transition"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register">
            <span className="text-blue-600 hover:underline font-medium">
              Regístrate
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

