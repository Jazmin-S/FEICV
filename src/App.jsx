
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./pages/menú/Menu";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Redirigir automáticamente al menú principal */}
        <Route path="/" element={<Navigate to="/menu" replace />} />

        {/* Pantalla del menú principal */}
        <Route path="/menu" element={<Menu />} />

        {/* Redirigir rutas no existentes al menú */}
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
