import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserList from "./components/users/UserList.jsx";

import SpaceList from "./components/spaces/SpaceList.jsx";
import CreateSpace from "./components/spaces/CreateSpace.jsx";
import ReservationAgenda from "./components/reservations/ReservationAgenda.jsx";
import CreateUser from "./components/users/CreateUser.jsx";

import CreateReservation from "./components/reservations/CreateReservation.jsx";

function App() {
  return (
    <Router>
      <div className="app-container">

        <nav className="main-nav">
          <Link to="/">Home (Espaços)</Link>
          <Link to="/reservations/new">Nova Reserva</Link>
          <Link to="/agenda">Agenda de Reservas</Link>
          <Link to="/spaces/new">Cadastrar Espaço</Link>
          <Link to="/users/new">Cadastrar Cliente</Link>
          <Link to="/users">Gerenciar Clientes</Link>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<SpaceList />} />
            <Route path="/agenda" element={<ReservationAgenda />} />
            <Route path="/spaces/new" element={<CreateSpace />} />
            <Route path="/users/new" element={<CreateUser />} />
            <Route path="/reservations/new" element={<CreateReservation />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;