import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CrearProyectoPage from './pages/CrearProyectoPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './routes/PrivateRoute';
import { saveToken } from './services/auth';
import CrearCompraPage from './pages/CrearCompraPage';
import ProyectoResumenPage from './pages/ProyectoResumenPage';
import PanelProyectosPage from './pages/PanelProyectosPage';
import DashboardProyectoPage from './pages/DashboardProyectoPage';

function LoginWrapper() {
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    saveToken(token);
    navigate('/panel');
  };

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      onGoToRegister={() => navigate('/register')}
    />
  );
}

function RegisterWrapper() {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  return <RegisterPage onRegisterSuccess={handleRegisterSuccess} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/register" element={<RegisterWrapper />} />

        <Route
          path="/proyectos/crear"
          element={
            <PrivateRoute>
              <CrearProyectoPage />
            </PrivateRoute>
          }
        />
		<Route
		  path="/proyectos/:id/compras/crear"
		  element={
            <PrivateRoute>
              <CrearCompraPage />
            </PrivateRoute>
          }
        />
		<Route
          path="/proyectos/:id/resumen"
          element={
            <PrivateRoute>
              <ProyectoResumenPage />
            </PrivateRoute>
          }
        />
		<Route
          path="/proyectos/:id/dashboard"
          element={
            <PrivateRoute>
              <DashboardProyectoPage />
            </PrivateRoute>
          }
        />	
		<Route
          path="/panel"
          element={
            <PrivateRoute>
             <PanelProyectosPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/panel" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;