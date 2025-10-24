import React, { useState } from 'react';
import { NinjaJardineroLogoIcon, EyeIcon, EyeOffIcon } from './Icons';

export interface User {
    username: string;
    email: string;
    password?: string; // Password is required for a full user object, but optional for credentials
}

export interface UserCredentials extends Omit<User, 'username'> {
    username?: string;
}

interface LoginProps {
  onLogin: (credentials: UserCredentials) => Promise<void>;
  onSignUp: (credentials: UserCredentials) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignUp }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        if (isLoginView) {
            if (!email || !password) {
                throw new Error("El correo y la contraseña son obligatorios.");
            }
            await onLogin({ email, password });
        } else {
            if (!username || !email || !password) {
                throw new Error("Todos los campos son obligatorios.");
            }
            await onSignUp({ username, email, password });
        }
    } catch (err: any) {
        setError(err.message || "Ha ocurrido un error inesperado.");
    } finally {
        setIsLoading(false);
    }
  };

  const toggleView = () => {
      setIsLoginView(!isLoginView);
      setError('');
      setUsername('');
      setEmail('');
      setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-xl shadow-lg border border-subtle">
        <div className="text-center">
            <NinjaJardineroLogoIcon className="h-28 w-auto mx-auto" />
            <h1 className="text-3xl font-bold text-light mt-4 tracking-wider">NINJA JARDÍN</h1>
            <p className="text-medium mt-2">{isLoginView ? 'Ingresa para gestionar tu jardín secreto.' : 'Crea tu cuenta para empezar a cultivar.'}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {!isLoginView && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-medium">Nombre de Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                required={!isLoginView}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Tu apodo de cultivador"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-medium">Correo Electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-medium">Contraseña</label>
            <div className="relative mt-1">
                 <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-medium hover:text-light"
                >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-400 text-center bg-red-900/20 p-2 rounded-md">{error}</p>}
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-medium disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : (isLoginView ? 'Entrar' : 'Crear Cuenta')}
          </button>

          <p className="text-center text-sm">
            <span className="text-medium">
                {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </span>
            <button type="button" onClick={toggleView} className="font-semibold text-accent hover:underline ml-1">
                {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
