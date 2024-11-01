import React, { useState } from 'react';
import {
  Nav,
  NavItem,
  NavLink,
  Collapse,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { 
  faTachometerAlt, 
  faDatabase, 
  faTable, 
  faFileArchive, 
  faUndoAlt, 
  faCog, 
  faShieldAlt, 
  faChartLine, 
  faFire,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ items, onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const styles = {
    sidebar: {
      width: '280px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'linear-gradient(180deg, #2c3e50 0%, #3498db 100%)',
      color: 'white',
      padding: '1rem 0',
      boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto',
      zIndex: 1000
    },
    nav: {
      width: '100%'
    },
    navItem: {
      margin: '0.25rem 0'
    },
    navLink: {
      color: 'rgba(255, 255, 255, 0.8)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        color: 'white',
        background: 'rgba(255, 255, 255, 0.1)'
      }
    },
    icon: {
      width: '20px',
      marginRight: '10px'
    },
    subItems: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      margin: '0 0.5rem',
      borderRadius: '4px'
    },
    subItem: {
      padding: '0.5rem 1rem 0.5rem 3rem',
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      '&:hover': {
        color: 'white',
        background: 'rgba(255, 255, 255, 0.05)'
      }
    },
    chevron: {
      fontSize: '0.75rem',
      transition: 'transform 0.3s ease'
    },
    chevronExpanded: {
      transform: 'rotate(90deg)'
    },
    title: {
      display: 'flex',
      alignItems: 'center'
    },
    logoContainer: {
      padding: '1rem 1.5rem 2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '1rem'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center'
    }
  };

  const toggleSubItems = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderMenuItem = (item) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems[item.id];

    return (
      <NavItem key={item.id} style={styles.navItem}>
        <NavLink
          tag="div"
          style={{
            ...styles.navLink,
            background: isExpanded ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
          }}
          className="nav-link-custom"
          onClick={() => {
            if (hasSubItems) {
              toggleSubItems(item.id);
            } else {
              onNavigate(item.path);
            }
          }}
        >
          <div style={styles.title}>
            <FontAwesomeIcon icon={item.icon} style={styles.icon} />
            <span>{item.title}</span>
          </div>
          {hasSubItems && (
  <FontAwesomeIcon
    icon={faAngleRight} // Usando el nuevo ícono
    style={{
      ...styles.chevron,
      ...(isExpanded ? styles.chevronExpanded : {})
    }}
  />
)}
        </NavLink>

        {hasSubItems && (
          <Collapse isOpen={isExpanded}>
            <Nav vertical style={styles.subItems}>
              {item.subItems.map(subItem => (
                <NavItem key={subItem.id}>
                  <NavLink
                    tag="div"
                    style={styles.subItem}
                    className="nav-link-custom"
                    onClick={() => onNavigate(subItem.path)}
                  >
                    <FontAwesomeIcon icon={subItem.icon} style={styles.icon} />
                    {subItem.title}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Collapse>
        )}
      </NavItem>
    );
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <a href="/" style={styles.logo}>
          <FontAwesomeIcon icon={faDatabase} style={{ ...styles.icon, fontSize: '1.5rem' }} />
          Admin Panel
        </a>
      </div>
      <Nav vertical style={styles.nav}>
        {items.map(renderMenuItem)}
      </Nav>
    </div>
  );
};

// Estilos CSS globales necesarios
const GlobalStyles = `
  .nav-link-custom {
    color: rgba(255, 255, 255, 0.8) !important;
  }
  
  .nav-link-custom:hover {
    color: white !important;
    background: rgba(255, 255, 255, 0.1);
  }
  
  // Ajuste del contenido principal para el sidebar permanente
  .main-content {
    margin-left: 280px;
    transition: margin-left 0.3s ease;
    padding: 2rem;
  }
`;

export default Sidebar;