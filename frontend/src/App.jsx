import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ClientList from './components/ClientList';
import AddClientForm from './components/AddClientForm';
import RenewMembership from './components/RenewMembership';
import EditClient from './components/EditClient';
import EditMembership from './components/EditMembership';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Lista de Clientes</Link>
            </li>
            <li>
              <Link to="/add">Añadir Cliente</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<ClientList />} />
          <Route path="/add" element={<AddClientForm />} />
          <Route path="/renew-membership/:id" element={<RenewMembership />} />
          <Route path="/edit-membership/:id" element={<EditMembership />} />
          <Route path="/edit-client/:id" element={<EditClient />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;