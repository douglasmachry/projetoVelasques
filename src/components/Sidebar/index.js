import React from 'react';

import { Container, SidebarLink } from './styles';

function Sidebar() {
  return (
    <Container>
      <SidebarLink to="/">Lista de Clientes</SidebarLink>
      <SidebarLink to="/listaMaiorCompra">Maior Compra</SidebarLink>
      <SidebarLink to="/listaFidelidade">Lista por Fidelidade</SidebarLink>
    </Container>
  );
}

export default Sidebar;