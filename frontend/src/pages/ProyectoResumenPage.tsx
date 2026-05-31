import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { ResumenProyecto } from '../types/resumenProyecto';

function ProyectoResumenPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resumen, setResumen] = useState<ResumenProyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'No definido';

    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const obtenerResumen = async () => {
      try {
        const response = await api.get(`/proyectos/${id}/resumen`);
        setResumen(response.data.data);
      } catch (err: any) {
        const backendMessage =
          err?.response?.data?.message || 'No se pudo obtener el resumen';
        setError(
          Array.isArray(backendMessage)
            ? backendMessage.join(', ')
            : backendMessage,
        );
      } finally {
        setLoading(false);
      }
    };

    obtenerResumen();
  }, [id]);

  if (loading) {
    return <div style={pageStyle}>Cargando resumen...</div>;
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <p style={{ color: '#b91c1c', textAlign: 'center' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!resumen) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <p>No hay resumen disponible.</p>
        </div>
      </div>
    );
  }

  const { finanzas } = resumen;
  
  const porcentajeConsumo =
  finanzas.presupuesto > 0
    ? Number(((finanzas.costoTotal / finanzas.presupuesto) * 100).toFixed(1))
    : 0;
  
  const estadoVisual =
  porcentajeConsumo >= 100
    ? 'SOBRECONSUMO'
    : porcentajeConsumo >= 80
    ? 'EN RIESGO'
    : porcentajeConsumo >= 50
    ? 'EN OBSERVACIÓN'
    : 'SALUDABLE';
  
  const estadoColor =
  estadoVisual === 'SALUDABLE'
    ? '#15803d'
    : estadoVisual === 'EN OBSERVACIÓN'
    ? '#ca8a04'
    : estadoVisual === 'EN RIESGO'
    ? '#f97316'
    : '#dc2626';

  const estadoBackground =
  estadoVisual === 'SALUDABLE'
    ? '#dcfce7'
    : estadoVisual === 'EN OBSERVACIÓN'
    ? '#fef9c3'
    : estadoVisual === 'EN RIESGO'
    ? '#ffedd5'
    : '#fee2e2';
  
  const gananciaEsperada =
  finanzas.precioVenta !== null
    ? finanzas.precioVenta - finanzas.presupuesto
    : null;

  const margenEsperadoPorcentaje =
  finanzas.precioVenta !== null && finanzas.precioVenta > 0
    ? Number(((gananciaEsperada! / finanzas.precioVenta) * 100).toFixed(2))
    : null;

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={successCircle}>✓</div>
		
		<button
          style={backButtonStyle}
          onClick={() => navigate('/panel')}
        >
          ← Volver al panel
        </button> 

        <h1 style={titleStyle}>Proyecto listo para operar</h1>
        <p style={subtitleStyle}>Resumen financiero inicial</p>

        <div style={summaryBoxStyle}>
          <Row label="Presupuesto" value={formatCurrency(finanzas.presupuesto)} />
          <Row label="Precio venta" value={formatCurrency(finanzas.precioVenta)} />
		  <Row
			label="Ganancia esperada"
			value={formatCurrency(gananciaEsperada)}
			highlight
		  />
			<Row
			label="Margen esperado"
			value={
			margenEsperadoPorcentaje !== null
			? `${margenEsperadoPorcentaje}%`
			: 'No definido'
		  }
			highlight
		  />
		  
        </div>
		
		<div style={dashboardGridStyle}>
      
	   <DashboardCard
          title="Gastado"
          value={formatCurrency(finanzas.costoTotal)}
       />

       <DashboardCard
           title="Disponible"
           value={formatCurrency(finanzas.saldoDisponible)}
       />

       <DashboardCard
           title="% Consumo"
           value={`${porcentajeConsumo}%`}
       />
	  
        </div>

        <div 
		  style={{
           ...statusBoxStyle,
           background: estadoBackground,
           color: estadoColor,
          }}
		>
          <strong style={{ color: estadoColor }}>
		  Estado financiero:
		   </strong>{' '}
		  {estadoVisual}
        </div>

        <button
          style={primaryButtonStyle}
          onClick={() => navigate(`/proyectos/${id}/compras/crear`)}
        >
          {finanzas.costoTotal === 0
          ? 'Registrar primera compra →'
           : 'Registrar nueva compra →'}
        </button>

        <button
          style={secondaryButtonStyle}
          onClick={() => navigate(`/proyectos/${id}/dashboard`)}
        >
          Ver detalle financiero
        </button>
		
		<button
          style={editButtonStyle}
          onClick={() =>
            alert('Edición de proyecto pendiente para D14/V2')
          }
        >
          Editar proyecto
        </button>	
      </div>
    </div>
  );
}

type RowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function Row({ label, value, highlight = false }: RowProps) {
  return (
    <div style={rowStyle}>
      <span style={rowLabelStyle}>{label}</span>
      <span
        style={{
          ...rowValueStyle,
          color: highlight ? '#047857' : '#111827',
        }}
      >
        {value}
      </span>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  value: string;
};

function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div style={dashboardCardStyle}>
      <span style={dashboardTitleStyle}>{title}</span>

      <strong style={dashboardValueStyle}>
        {value}
      </strong>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100dvh',
  background: '#f4f6f8',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '8px 20px',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
};


const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '520px',
  maxHeight: 'calc(100vh - 24px)',
  background: '#ffffff',
  borderRadius: '18px',
  padding: '10px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
};

const successCircle: React.CSSProperties = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  background: '#d1fae5',
  color: '#047857',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: 700,
  margin: '0 auto 16px',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '20px',
  color: '#111827',
  marginBottom: '6px',
};

const subtitleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#6b7280',
  marginBottom: '16px',
};

const summaryBoxStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '14px',
  padding: '8px 14px',
  marginBottom: '18px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '6px 0',
  borderBottom: '1px solid #e5e7eb',
};

const rowLabelStyle: React.CSSProperties = {
  color: '#6b7280',
};

const rowValueStyle: React.CSSProperties = {
  fontWeight: 700,
};

const statusBoxStyle: React.CSSProperties = {
  background: '#eef2ff',
  color: '#3730a3',
  padding: '6px',
  borderRadius: '10px',
  textAlign: 'center',
  marginBottom: '10px',
};

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: 'none',
  borderRadius: '10px',
  background: '#2563eb',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '16px',
  cursor: 'pointer',
  marginBottom: '8px',
};

const secondaryButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  background: '#ffffff',
  color: '#374151',
  fontWeight: 600,
  fontSize: '16px',
  cursor: 'pointer',
};



const dashboardGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '6px',
  marginBottom: '8px',
};

const dashboardCardStyle: React.CSSProperties = {
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '6px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const dashboardTitleStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '11px',
};

const dashboardValueStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#111827',
};

const editButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  background: '#f9fafb',
  color: '#374151',
  fontWeight: 600,
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '8px',
};7

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

export default ProyectoResumenPage;