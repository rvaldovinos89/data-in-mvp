import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { CompraPayload } from '../types/compra';
import { formatCLPInput, parseCLPInput } from '../utils/currency';

function CrearCompraPage() {
  console.log('CrearCompraPage cargó');
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');

    if (!nombre.trim() || !monto || !proveedor.trim() || !categoria.trim()) {
      setMensaje('Debes completar monto, proveedor y categoría');
      return;
    }

    try {
     const payload: CompraPayload = {
     nombre,
     monto: parseCLPInput(monto) ?? 0,
     proveedor,
     categoria,
     proyectoId: Number(id),
     } as any;

      await api.post('/compras', payload);

      setMensaje('Compra registrada correctamente');

      setTimeout(() => {
        navigate(`/proyectos/${id}/resumen`);
      }, 800);
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message || 'Error al registrar compra';

      setMensaje(
        Array.isArray(backendMessage)
          ? backendMessage.join(', ')
          : backendMessage,
      );
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
	  <button
         style={backButtonStyle}
         onClick={() =>
           navigate(`/proyectos/${id}/resumen`)
        }
      >
        ← Volver al resumen
      </button>
        <h1 style={titleStyle}>Registrar compra</h1>
        <p style={subtitleStyle}>
          Ingresa un gasto asociado a un proyecto
        </p>

        <form onSubmit={handleSubmit}>
		 <div style={fieldGroupStyle}>
           <label style={labelStyle}>Detalle de la compra *</label>
           <input
             type="text"
             value={nombre}
             onChange={(e) => setNombre(e.target.value)}
             placeholder="Ej: Pago proveedor, compra de insumos, servicio externo"
             style={inputStyle}
            />
          </div>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Monto *</label>
            <input
              type="text"
              value={monto ? formatCLPInput(monto) : ''}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="CLP 25.000"
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Proveedor *</label>
            <input
              type="text"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              placeholder="Ej: Sodimac"
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Categoría *</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={inputStyle}
            >
              <option value="">Selecciona una categoría</option>
              <option value="materiales">Materiales</option>
              <option value="herramientas">Herramientas</option>
              <option value="transporte">Transporte</option>
              <option value="servicios">Servicios</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          {mensaje && (
            <div
              style={{
                ...messageStyle,
                background:
                  mensaje === 'Compra registrada correctamente'
                    ? '#e8f5e9'
                    : '#fdecea',
                color:
                  mensaje === 'Compra registrada correctamente'
                    ? '#166534'
                    : '#b91c1c',
              }}
            >
              {mensaje}
            </div>
          )}

          <button type="submit" style={buttonStyle}>
            Guardar compra
          </button>
        </form>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f4f6f8',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '520px',
  background: '#ffffff',
  borderRadius: '16px',
  padding: '32px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '28px',
  color: '#1f2937',
  marginBottom: '8px',
};

const subtitleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#6b7280',
  marginBottom: '24px',
};

const fieldGroupStyle: React.CSSProperties = {
  marginBottom: '18px',
};

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

const messageStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: '10px',
  marginBottom: '16px',
  textAlign: 'center',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  border: 'none',
  borderRadius: '10px',
  background: '#2563eb',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '16px',
  cursor: 'pointer',
};

const backButtonStyle: React.CSSProperties = {
  marginBottom: '16px',
  background: 'transparent',
  border: 'none',
  color: '#2563eb',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '14px',
  padding: 0,
};

export default CrearCompraPage;