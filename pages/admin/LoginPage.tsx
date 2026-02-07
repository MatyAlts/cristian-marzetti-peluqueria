import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from './AuthContext';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/admin/productos', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin/productos', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gold-500">MARZETTI</h1>
          <p className="text-neutral-400 text-sm mt-1">Panel de Administración</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 shadow-lg border border-dark-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gold-500 text-dark-900 font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-neutral-500 hover:text-gold-500 transition-colors text-sm inline-flex items-center gap-1">
            <ArrowLeft size={14} />
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
};
