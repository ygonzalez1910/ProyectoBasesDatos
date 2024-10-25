import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import AppRoutes from "../routes/AppRoutes";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [menuItems] = useState([
    {
      id: 1,
      title: "Dashboard",
      path: "/",
      icon: "dashboard",
      subItems: [],
    },
    {
      id: 2,
      title: "Respaldo",
      path: "/respaldo",
      icon: "backup",
      subItems: [
        {
          id: 21,
          title: "Tabla de Respaldos",
          path: "/respaldo/tabla",
          icon: "table",
        },
        {
          id: 22,
          title: "Recuperar Respaldo",
          path: "/respaldo/recuperar",
          icon: "restore",
        },
        {
          id: 23,
          title: "Administrar Respaldo",
          path: "/respaldo/administrar",
          icon: "settings",
        },
        {
          id: 24,
          title: "Respaldo Completo",
          path: "/respaldo/completo",
          icon: "backup",
        },
        {
          id: 25,
          title: "Respaldo de Esquema",
          path: "/respaldo/esquema",
          icon: "schema",
        },
      ],
    },
    {
      id: 3,
      title: "Administrar TableSpace",
      path: "/administrarTableSpace",
      icon: "storage",
      subItems: [],
    },
    {
      id: 4,
      title: "Tunning",
      path: "/tunning",
      icon: "tune",
      subItems: [
        {
          id: 41,
          title: "Estadísticas",
          path: "/tunning/estadisticas",
          icon: "analytics",
        },
        {
          id: 42,
          title: "Índices",
          path: "/tunning/indices",
          icon: "list",
        },
        {
          id: 43,
          title: "Planes de Ejecución",
          path: "/tunning/planes",
          icon: "assessment",
        },
      ],
    },
    {
      id: 5,
      title: "Performance",
      path: "/performance",
      icon: "speed",
      subItems: [],
    },
    {
      id: 6,
      title: "Auditoría",
      path: "/auditoria",
      icon: "security",
      subItems: [],
    },
    {
      id: 7,
      title: "Seguridad",
      path: "/seguridad",
      icon: "shield",
      subItems: [],
    },
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="layout">
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col
            xs={3}
            className={`sidebar-col p-0 ${isSidebarOpen ? "open" : "closed"}`}
          >
            <Sidebar
              isOpen={isSidebarOpen}
              onToggle={toggleSidebar}
              items={menuItems}
              onNavigate={handleNavigation}
            />
          </Col>
          <Col xs={9} className="main-content-col p-0">
            <AppRoutes />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;
