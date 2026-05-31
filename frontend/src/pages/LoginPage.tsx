import { useState } from 'react';
import { api } from '../services/api';

type LoginPageProps = {
  onLoginSuccess: (token: string) => void;
  onGoToRegister: () => void;
};

function LoginPage({ onLoginSuccess, onGoToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Debes ingresar correo y contraseña');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const token = response.data.data.access_token;

      if (!token) {
        setError('No se recibió token de autenticación');
        return;
      }

      onLoginSuccess(token);
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message || 'Credenciales inválidas';

      setError(
        Array.isArray(backendMessage)
          ? backendMessage.join(', ')
          : backendMessage,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f4f6f8',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        <h1
          style={{
            marginBottom: '8px',
            fontSize: '28px',
            color: '#1f2937',
            textAlign: 'center',
          }}
        >
          DataIN
        </h1>

        <p
          style={{
            marginBottom: '24px',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@empresa.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={inputStyle}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#fdecea',
                color: '#b91c1c',
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '10px',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
		  <button
			type="button"
			onClick={onGoToRegister}
			style={{
			marginTop: '16px',
			width: '100%',
			border: 'none',
			background: 'transparent',
			color: '#2563eb',
			cursor: 'pointer',
			fontWeight: 600,
			}}
			>
			¿No tienes cuenta? Crear cuenta
			</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #d1d5db',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
};

export default LoginPage;