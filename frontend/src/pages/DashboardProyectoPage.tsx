import { useNavigate, useParams } from 'react-router-dom';

function DashboardProyectoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
        <h1 style={titleStyle}>
          Dashboard financiero
        </h1>

        <p style={subtitleStyle}>
          Proyecto ID: {id}
        </p>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3f4f6',
  display: 'flex',
  justifyContent: 'center',
  padding: '24px',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '900px',
  background: '#fff',
  borderRadius: '20px',
  padding: '24px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '28px',
  marginBottom: '8px',
};

const subtitleStyle: React.CSSProperties = {
  color: '#6b7280',
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

export default DashboardProyectoPage;