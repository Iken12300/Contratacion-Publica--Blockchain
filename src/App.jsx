// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Home from "./components/Home";
import CrearLicitacion from "./components/CrearLicitacion";
import ListarLicitaciones from "./components/ListarLicitaciones";
import ProtectedRoute from "./components/ProtectedRoute";
import EnviarPropuesta from "./components/EnviarPropuesta";
import GestionAdministradores from "./components/GestionAdministradores";
import EvaluacionPropuestas from "./components/EvaluacionPropuestas";
import HistorialTransacciones from "./components/HistorialTransacciones";
import MisPropuestas from "./components/MisPropuestas";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-licitacion"
            element={
              <ProtectedRoute>
                <CrearLicitacion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/licitaciones"
            element={
              <ProtectedRoute>
                <ListarLicitaciones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/licitacion/:id/propuesta"
            element={
              <ProtectedRoute>
                <EnviarPropuesta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestion-admins"
            element={
              <ProtectedRoute>
                <GestionAdministradores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluacion-propuestas"
            element={
              <ProtectedRoute>
                <EvaluacionPropuestas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <HistorialTransacciones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-propuestas"
            element={
              <ProtectedRoute>
                <MisPropuestas />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
