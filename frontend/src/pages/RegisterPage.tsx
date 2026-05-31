import { useState } from 'react';
import { api } from '../services/api';

type RegisterPageProps = {
  onRegisterSuccess: () => void;
};

function RegisterPage({ onRegisterSuccess }: RegisterPageProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
	
	if (email !== confirmEmail) {
      setError('Los correos no coinciden');
      return;
    }

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError('Debes completar nombre, correo y contraseña');
      return;
    }

    try {
      setLoading(true);

      await api.post('/auth/register', {
        nombre,
        email,
        password,
      });

      setSuccess('Usuario creado correctamente. Ahora puedes iniciar sesión.');

      setTimeout(() => {
        onRegisterSuccess();
      }, 1200);
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message || 'No se pudo crear el usuario';

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
        alignItems: 'flex-start',
        background: '#f4f6f8',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        padding: '10px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '22px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        <h1
          style={{
            marginBottom: '8px',
            fontSize: '24px',
            color: '#1f2937',
            textAlign: 'center',
          }}
        >
          Crear cuenta
        </h1>

        <p
          style={{
            marginBottom: '16px',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          Regístrate para comenzar a usar DataIN
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Raúl Valdovinos"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@empresa.com"
              style={inputStyle}
            />
          </div>
		  
		  <div style={{ marginBottom: '12px' }}>
		    <label style={labelStyle}>Confirmar correo electrónico</label>

            <input
			  style={inputStyle}
			  type="email"
			  value={confirmEmail}
			  onChange={(e) => setConfirmEmail(e.target.value)}
			  placeholder="Repite tu correo"
			/>
		  </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 4 caracteres"
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

          {success && (
            <div
              style={{
                background: '#e8f5e9',
                color: '#166534',
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              border: 'none',
              borderRadius: '10px',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <button
          type="button"
          onClick={onRegisterSuccess}
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
          Ya tengo cuenta, iniciar sesión
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 600,
  color: '#374151',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #d1d5db',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
};

export default RegisterPage;