import { useEffect, useState } from 'react';
import { api } from '../services/api';

type RegisterPageProps = {
  onRegisterSuccess: () => void;
};

type Empresa = {
  id: number;
  nombre: string;
  rut: string;
};

function RegisterPage({ onRegisterSuccess }: RegisterPageProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState('');
  const [mostrarCrearEmpresa, setMostrarCrearEmpresa] = useState(false);
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [rutEmpresa, setRutEmpresa] = useState('');
  const [guardandoEmpresa, setGuardandoEmpresa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  
  useEffect(() => {
		async function cargarEmpresas() {
		try {
          const response = await api.get('/empresas');
          setEmpresas(response.data.data || []);
		} catch (error) {
          setError('No se pudieron cargar las empresas');
		}
	  }
		cargarEmpresas();
	}, []);
	
  const handleCrearEmpresa = async () => {
  setError('');
  setSuccess('');

  if (!nombreEmpresa.trim() || !rutEmpresa.trim()) {
    setError('Debes completar el nombre y el RUT de la empresa');
    return;
  }

  try {
    setGuardandoEmpresa(true);

    const response = await api.post('/empresas', {
      nombre: nombreEmpresa.trim(),
      rut: rutEmpresa.trim(),
    });

    const nuevaEmpresa = response.data.data;

    setEmpresas((empresasActuales) => [
      ...empresasActuales,
      nuevaEmpresa,
    ]);

    setEmpresaId(String(nuevaEmpresa.id));
    setNombreEmpresa('');
    setRutEmpresa('');
    setMostrarCrearEmpresa(false);

    setSuccess('Empresa creada y seleccionada correctamente');
  } catch (err: any) {
    const backendMessage =
      err?.response?.data?.message || 'No se pudo crear la empresa';

    setError(
      Array.isArray(backendMessage)
        ? backendMessage.join(', ')
        : backendMessage,
    );
  } finally {
    setGuardandoEmpresa(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
	
	if (email !== confirmEmail) {
      setError('Los correos no coinciden');
      return;
    }

    if (!nombre.trim() || !email.trim() || !password.trim() || !empresaId) {
    setError('Debes completar nombre, correo, contraseña y empresa');
    return;
    }

    try {
      setLoading(true);

      await api.post('/auth/register', {
        nombre,
        email,
        password,
		empresaId: Number(empresaId),
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
        alignItems: 'center',
        background: '#f4f6f8',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        padding: '8px 20px',
		boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 22px',
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
            marginBottom: '12px',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          Regístrate para comenzar a usar DataIN
        </p>

       
		
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Nombre y apellido"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@empresa.com"
              style={inputStyle}
            />
          </div>
		  
		  <div style={{ marginBottom: '10px' }}>
		    <label style={labelStyle}>Confirmar correo electrónico</label>

            <input
			  style={inputStyle}
			  type="email"
			  value={confirmEmail}
			  onChange={(e) => setConfirmEmail(e.target.value)}
			  placeholder="Repite tu correo"
			/>
		  </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 4 caracteres"
              style={inputStyle}
            />
          </div>
		  
		  <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Empresa</label>
			<select
				value={empresaId}
				onChange={(e) => setEmpresaId(e.target.value)}
				style={inputStyle}
			>
		<option value="">Selecciona una empresa</option>

		{empresas.map((empresa) => (
		<option key={empresa.id} value={empresa.id}>
        {empresa.nombre} - {empresa.rut}
		</option>
		))}
	</select>
		<button
		type="button"
		onClick={() => setMostrarCrearEmpresa(!mostrarCrearEmpresa)}
		style={secondaryButtonStyle}
	>
		{mostrarCrearEmpresa
			? 'Cancelar creación de empresa'
			: '+ Crear nueva empresa'}
		</button>
	</div>
	
	{mostrarCrearEmpresa && (
  <div style={createCompanyBoxStyle}>
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>Nombre de la empresa</label>

      <input
        type="text"
        value={nombreEmpresa}
        onChange={(e) => setNombreEmpresa(e.target.value)}
        placeholder="Ej: Constructora Los Andes"
        style={inputStyle}
      />
    </div>

    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>RUT de la empresa</label>

      <input
        type="text"
        value={rutEmpresa}
        onChange={(e) => setRutEmpresa(e.target.value)}
        placeholder="Ej: 12345678-9"
        style={inputStyle}
      />
    </div>

    <button
  type="button"
  onClick={handleCrearEmpresa}
  disabled={guardandoEmpresa}
  style={{
    ...secondaryButtonStyle,
    cursor: guardandoEmpresa ? 'not-allowed' : 'pointer',
    opacity: guardandoEmpresa ? 0.7 : 1,
  }}
    >
  {guardandoEmpresa ? 'Guardando empresa...' : 'Guardar empresa'}
	</button>
  </div>
)}

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

const secondaryButtonStyle: React.CSSProperties = {
  marginTop: '10px',
  width: '100%',
  padding: '10px',
  border: '1px solid #2563eb',
  borderRadius: '10px',
  background: '#ffffff',
  color: '#2563eb',
  fontWeight: 600,
  cursor: 'pointer',
};

const createCompanyBoxStyle: React.CSSProperties = {
  marginBottom: '16px',
  padding: '14px',
  borderRadius: '12px',
  border: '1px solid #dbeafe',
  background: '#eff6ff',
};

export default RegisterPage;