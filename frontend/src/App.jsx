import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ClientList from './components/ClientList';
import AddClientForm from './components/AddClientForm';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;