// src/layouts/Layout.js
import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import AppRoutes from "../routes/AppRoutes";
import { faTachometerAlt, faDatabase, faTable, faFileArchive, faUndoAlt, faCog, faShieldAlt, faChartLine, faFire, faBook, faDownload, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [menuItems] = useState([
    {
      id: 1,
      title: "Dashboard",
      path: "/",
      icon: faTachometerAlt,
      subItems: [],
    },
    {
      id: 2,
      title: "Respaldo",
      path: "/respaldo",
      icon: faDatabase,
      subItems: [
        {
          id: 21,
          title: "Respaldo Tabla",
          path: "/respaldo/tabla",
          icon: faTable,
        },
        {
          id: 25,
          title: "Respaldo de Esquema",
          path: "/respaldo/esquema",
          icon: faFileArchive,
        },
        {
          id: 24,
          title: "Respaldo Completo",
          path: "/respaldo/completo",
          icon: faDownload,
        },
        {
          id: 22,
          title: "Recuperar Respaldo",
          path: "/respaldo/recuperar",
          icon: faUndoAlt,
        },
        {
          id: 23,
          title: "Administrar Respaldo",
          path: "/respaldo/administrar",
          icon: faCog,
        },
      ],
    },
    {
      id: 3,
      title: "Administrar TableSpace",
      path: "/administrarTableSpace",
      icon: faFolderOpen,
      subItems: [],
    },
    {
      id: 4,
      title: "Tunning",
      path: "/tunning",
      icon: faFire,
      subItems: [],
    },
    {
      id: 5,
      title: "Performance",
      path: "/performance",
      icon: faChartLine,
      subItems: [],
    },
    {
      id: 6,
      title: "Auditoría",
      path: "/auditoria",
      icon: faBook,
      subItems: [],
    },
    {
      id: 7,
      title: "Seguridad",
      path: "/seguridad",
      icon: faShieldAlt,
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
        <Row className="h-100 g-0"> {/* g-0 elimina el gutters */}
          <Col
            xs={2}
            className={`sidebar-col p-0 ${isSidebarOpen ? "open" : "closed"}`}
          >
            <Sidebar
              isOpen={isSidebarOpen}
              onToggle={toggleSidebar}
              items={menuItems}
              onNavigate={handleNavigation}
            />
          </Col>
          <Col xs={10} className="main-content-col px-5 px-lg-6"> {/* padding más grande en pantallas grandes */}
            <AppRoutes />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;
