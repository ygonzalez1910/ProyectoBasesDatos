import React from 'react';
import { Container } from 'reactstrap';

const MainContent = () => {
  return (
    <Container fluid className="p-4">
      <h1>Contenido Principal</h1>
      <p>Bienvenido a la aplicación. Selecciona un ítem del menú para comenzar.</p>
    </Container>
  );
};

export default MainContent;