import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import ClientList from "./components/ClientList";
import AddClientForm from "./components/AddClientForm";
import RenewMembership from "./components/RenewMembership";
import EditClient from "./components/EditClient";
import EditMembership from "./components/EditMembership";
import UserHistory from "./components/UserHistory";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 w-64 h-full bg-gray-900 p-4 z-50 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <a
            href="#"
            className="flex items-center pb-4 border-b border-b-gray-800"
          >
            <img
              src="https://placehold.co/32x32"
              alt=""
              className="w-8 h-8 rounded object-cover"
            />
            <span className="text-lg font-bold text-white ml-3">
              Gimnasio App
            </span>
          </a>
          <ul className="mt-4">
            <li className="mb-1 group">
              <Link
                to="/"
                className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md"
              >
                <i className="ri-home-2-line mr-3 text-lg"></i>
                <span className="text-sm">Lista de Clientes</span>
              </Link>
            </li>
            <li className="mb-1 group">
              <Link
                to="/add"
                className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md"
              >
                <i className="ri-user-add-line mr-3 text-lg"></i>
                <span className="text-sm">Añadir Cliente</span>
              </Link>
            </li>
            {/* Puedes añadir más opciones de menú aquí */}
          </ul>
        </div>

        {/* Overlay para cerrar el sidebar en móviles */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden ${
            isSidebarOpen ? "block" : "hidden"
          }`}
          onClick={toggleSidebar}
        ></div>

        {/* Contenido principal */}
        <div className="flex-1 md:ml-64">
          {/* Botón para abrir/cerrar sidebar en móviles */}
          <button
            className="fixed top-4 left-4 z-50 md:hidden bg-gray-900 text-white p-2 rounded-md"
            onClick={toggleSidebar}
          >
            ☰
          </button>

          {/* Rutas */}
          <div className="p-4">
            <Routes>
              <Route path="/" element={<ClientList />} />
              <Route path="/add" element={<AddClientForm />} />
              <Route
                path="/renew-membership/:id"
                element={<RenewMembership />}
              />
              <Route path="/edit-membership/:id" element={<EditMembership />} />
              <Route path="/edit-client/:id" element={<EditClient />} />
              <Route path="/client/:id/history" element={<UserHistory />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
