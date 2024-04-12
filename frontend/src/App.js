import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ShowArchivos from "./components/ShowArchivos";
import ShowClientes from "./components/ShowClientes";
import ShowEmpleados from "./components/ShowEmpleados";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardWithNavbar />} />
        <Route path="/archivos" element={<ShowArchivosWithNavbar />} />
        <Route path="/clientes" element={<ShowClientesWithNavbar />} />
        <Route path="/empleados" element={<ShowEmpleadosWithNavbar />} />
      </Routes>
    </BrowserRouter>
  );
}

function DashboardWithNavbar() {
  return (
    <>
      <Navbar />
      <Dashboard />
    </>
  );
}
function ShowArchivosWithNavbar() {
  return (
    <>
      <Navbar />
      <ShowArchivos />
    </>
  );
}
function ShowClientesWithNavbar() {
  return (
    <>
      <Navbar />
      <ShowClientes />
    </>
  );
}
function ShowEmpleadosWithNavbar() {
  return (
    <>
      <Navbar />
      <ShowEmpleados />
    </>
  );
}
export default App;
