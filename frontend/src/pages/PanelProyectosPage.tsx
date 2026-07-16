import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { removeToken } from '../services/auth';

  type Proyecto = {
   id: number;
   nombre: string;
   presupuesto: number | null;
   costoTotal?: number;
   porcentajeConsumo?: number;
   estadoFinanciero?: string;
};

  type Empresa = {
   id: number;
   nombre: string;
   rut: string;
};

function PanelProyectosPage() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [paginaActual, setPaginaActual] = useState(1);
  
  const proyectosPorPagina = 10;

  const navigate = useNavigate();
  
  const handleLogout = () => {
  removeToken();
  navigate('/login');
};
  
  const getProgressColor = (porcentaje: number) => {
  if (porcentaje > 100) return '#dc2626';
  if (porcentaje >= 80) return '#f97316';
  if (porcentaje >= 50) return '#ca8a04';
  return '#22c55e';
};

  const getEstadoFinanciero = (porcentaje: number) => {
  if (porcentaje >= 100) return 'SOBRECONSUMO';
  if (porcentaje >= 80) return 'EN RIESGO';
  if (porcentaje >= 50) return 'EN OBSERVACIÓN';
  return 'SALUDABLE';
};

  useEffect(() => {
    async function cargarProyectos() {
  try {
    const response = await api.get('/proyectos');

    const proyectosBase = response.data.data || [];

    const proyectosConResumen = await Promise.all(
      proyectosBase.map(async (proyecto: Proyecto) => {
        try {
          const resumenResponse = await api.get(
            `/proyectos/${proyecto.id}/resumen`,
          );

          const resumen = resumenResponse.data.data;
		  console.log('Resumen proyecto', proyecto.id, resumen);

          const porcentajeConsumo =
            resumen.finanzas.presupuesto > 0
              ? Number(
                  (
                    (resumen.finanzas.costoTotal / resumen.finanzas.presupuesto) *
                     100
                  ).toFixed(1),
                )
               : 0;

          return {
            ...proyecto,
            costoTotal: resumen.finanzas.costoTotal,
            porcentajeConsumo,
            estadoFinanciero: getEstadoFinanciero(porcentajeConsumo),
          };
        } catch {
          return proyecto;
        }
      }),
    );

    setProyectos(proyectosConResumen);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

   

    cargarProyectos();
  }, []);

        const indiceUltimoProyecto = paginaActual * proyectosPorPagina;

        const indicePrimerProyecto =
        indiceUltimoProyecto - proyectosPorPagina;

        const proyectosPaginados = proyectos.slice(
        indicePrimerProyecto,
        indiceUltimoProyecto,
        );

        const totalPaginas = Math.ceil(
        proyectos.length / proyectosPorPagina,
        );
   useEffect(() => {
     async function cargarEmpresa() {
      try {
        const response = await api.get('/empresas/mi-empresa');

        setEmpresa(response.data.data);
      } catch (error) {
        console.error('Error al cargar la empresa:', error);
      }
    }

    cargarEmpresa();
 }, []);

  if (loading) {
    return <p>Cargando proyectos...</p>;
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        
	  <div style={headerStyle}>
        <div>
          <p style={companyLabelStyle}>Empresa activa</p>

          <p style={companyNameStyle}>
            🏢 {empresa?.nombre ?? 'Cargando empresa...'}
          </p>

          <h1 style={titleStyle}>Tus proyectos</h1>
        </div>

        <button style={logoutButtonStyle} onClick={handleLogout}>
          Cerrar sesión
        </button>
        </div>
		

        <button
          style={createButtonStyle}
          onClick={() => navigate('/proyectos/crear')}
        >
          + Crear proyecto
        </button>

        <div style={listStyle}>
          {proyectosPaginados.map((proyecto) => (
            <div key={proyecto.id} style={projectCardStyle}>
              <h2 style={projectTitleStyle}>
                {proyecto.nombre}
              </h2>

              <p style={projectBudgetStyle}>
                {proyecto.presupuesto !== null
                 ? `Presupuesto: CLP ${proyecto.presupuesto.toLocaleString('es-CL')}`
                 : 'Presupuesto no definido'}
              </p>
			  
			  {proyecto.presupuesto !== null && proyecto.porcentajeConsumo !== undefined && (
                <div style={statusContainerStyle}>
                  <div style={statusTextStyle}>
                   <span>{proyecto.porcentajeConsumo}% consumido</span>
                   <span>{proyecto.estadoFinanciero || 'Sin estado'}</span>
                </div>

                <div style={progressBarBackgroundStyle}>
                 <div
                   style={{
                     ...progressBarFillStyle,
                     width: `${Math.min(proyecto.porcentajeConsumo, 100)}%`,
                     background: getProgressColor(proyecto.porcentajeConsumo),
                   }}
                 />
               </div>
              </div>
            )}

              <div style={actionsStyle}>
                <button
                  style={summaryButtonStyle}
                  onClick={() =>
                    navigate(`/proyectos/${proyecto.id}/resumen`)
                  }
                >
                  Ver resumen
                </button>

                <button
                  style={purchaseButtonStyle}
                  onClick={() =>
                    navigate(`/proyectos/${proyecto.id}/compras/crear`)
                  }
                >
                  Registrar compra
                </button>
              </div>
            </div>
          ))}
        </div>
		
		 <div style={paginationContainerStyle}>
       <button
         style={paginationButtonStyle}
         disabled={paginaActual === 1}
         onClick={() =>
         setPaginaActual((prev) => prev - 1)
        }
       >
         ← Anterior
       </button>

       <span style={paginationTextStyle}>
         Página {paginaActual} de {totalPaginas}
       </span>

       <button
          style={paginationButtonStyle}
          disabled={paginaActual === totalPaginas}
          onClick={() =>
            setPaginaActual((prev) => prev + 1)
          }
         >
          Siguiente →
         </button>
        </div>
		
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  padding: '24px',
  background: '#f3f4f6',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '700px',
  background: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '28px',
  marginBottom: 0,
  color: '#111827',
};

const createButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  background: '#2563eb',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '16px',
  cursor: 'pointer',
  marginBottom: '24px',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const projectCardStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  padding: '18px',
  background: '#f9fafb',
};

const projectTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  marginBottom: '8px',
  color: '#111827',
};

const projectBudgetStyle: React.CSSProperties = {
  marginBottom: '14px',
  color: '#4b5563',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
};

const summaryButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  background: '#e5e7eb',
  cursor: 'pointer',
  fontWeight: 600,
};

const purchaseButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  background: '#2563eb',
  color: '#ffffff',
  cursor: 'pointer',
  fontWeight: 600,
};

const statusContainerStyle: React.CSSProperties = {
  marginBottom: '14px',
};

const statusTextStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '13px',
  color: '#4b5563',
  marginBottom: '6px',
};

const progressBarBackgroundStyle: React.CSSProperties = {
  width: '100%',
  height: '8px',
  background: '#e5e7eb',
  borderRadius: '999px',
  overflow: 'hidden',
};

const progressBarFillStyle: React.CSSProperties = {
  height: '100%',
  background: '#22c55e',
  borderRadius: '999px',
};

const paginationContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  marginTop: '24px',
};

const paginationButtonStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: '10px',
  border: '1px solid #d1d5db',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

const paginationTextStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#374151',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
};

const logoutButtonStyle: React.CSSProperties = {
  background: '#fee2e2',
  color: '#991b1b',
  border: '1px solid #fecaca',
  borderRadius: '12px',
  padding: '10px 14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const companyLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: '#6b7280',
  fontWeight: 600,
};

const companyNameStyle: React.CSSProperties = {
  margin: '4px 0 8px',
  fontSize: '18px',
  color: '#2563eb',
  fontWeight: 700,
};

export default PanelProyectosPage;