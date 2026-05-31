import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { ProyectoPayload } from '../types/proyecto';
import { formatCLPInput, parseCLPInput } from '../utils/currency';

function CrearProyectoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProyectoPayload>({
    nombre: '',
    presupuesto: undefined,
    precioVenta: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const margenProyectado = useMemo(() => {
    const presupuesto = formData.presupuesto ?? 0;
    const precioVenta = formData.precioVenta ?? 0;

    if (!precioVenta || precioVenta <= 0) return null;

    return precioVenta - presupuesto;
  }, [formData.presupuesto, formData.precioVenta]);

  const margenPorcentaje = useMemo(() => {
    const presupuesto = formData.presupuesto ?? 0;
    const precioVenta = formData.precioVenta ?? 0;

    if (!precioVenta || precioVenta <= 0) return null;

    return Number((((precioVenta - presupuesto) / precioVenta) * 100).toFixed(2));
  }, [formData.presupuesto, formData.precioVenta]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'presupuesto' || name === 'precioVenta') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseCLPInput(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload: ProyectoPayload = {
        nombre: formData.nombre,
        presupuesto: formData.presupuesto,
        precioVenta: formData.precioVenta,
      };

      const response = await api.post('/proyectos', payload);
     
	 const proyectoCreado = response.data.data;
     
navigate(`/proyectos/${proyectoCreado.id}/resumen`);
      
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message || 'No se pudo crear el proyecto';
      setError(
        Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '600px',
          width: '100%',
          padding: '40px',
        }}
      >
	  
	  <button
        style={backButtonStyle}
        onClick={() => navigate('/panel')}
      >
        ← Volver al panel
      </button>

        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#667eea',
              marginBottom: '10px',
            }}
          >
            DataIN
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Control financiero desde el proyecto
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 style={{ color: '#667eea', marginBottom: '20px' }}>
            Información esencial
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Campaña Digital Primavera 2025"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Presupuesto de Gastos del Proyecto *
            </label>
            <input
              type="text"
              name="presupuesto"
              value={
                formData.presupuesto !== undefined
                  ? formatCLPInput(String(formData.presupuesto))
                  : ''
              }
              onChange={handleChange}
              placeholder="CLP 1.000.000"
			  style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Precio de Venta (Opcional)
            </label>
            <input
              type="text"
              name="precioVenta"
              value={
                formData.precioVenta !== undefined
                ? formatCLPInput(String(formData.precioVenta))
                : ''
              }
              onChange={handleChange}
              placeholder="CLP 1.500.000"
			  style={inputStyle}
            />
          </div>

          {margenProyectado !== null && margenPorcentaje !== null && (
            <div
              style={{
                background: '#f5f7ff',
                border: '2px solid #cdd7ff',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: '#667eea', fontWeight: 600, marginBottom: '10px' }}>
                Margen Proyectado
              </div>
              <div
                style={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: margenProyectado >= 0 ? '#27ae60' : '#e74c3c',
                }}
              >
                ${margenProyectado.toLocaleString('es-CL')}
              </div>
              <div style={{ color: '#666', fontWeight: 600 }}>
                {margenPorcentaje}%
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                background: '#fdecea',
                color: '#b71c1c',
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '15px',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: '#e8f5e9',
                color: '#1b5e20',
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '15px',
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
              padding: '15px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Creando proyecto...' : 'Crear Proyecto'}
          </button>
        </form>
      </div>
    </div>
  );
}
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 15px',
  border: '2px solid #e1e8ed',
  borderRadius: '10px',
  fontSize: '15px',
  background: '#f8f9fa',
};

export default CrearProyectoPage;