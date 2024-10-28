// src/components/Sidebar.js
import React, { useState } from 'react';
import {
  Nav,
  NavItem,
  NavLink,
  Collapse,
  Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faDatabase, faTable, faFileArchive, faUndoAlt, faCog, faShieldAlt, faChartLine, faFire } from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onToggle, items, onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleSubItems = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderMenuItem = (item) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
  
    return (
      <NavItem key={item.id} className="sidebar-item">
        <NavLink
          className="d-flex justify-content-between align-items-center nav-link" // Asegúrate de usar 'nav-link' aquí
          onClick={() => {
            if (hasSubItems) {
              toggleSubItems(item.id);
            } else {
              onNavigate(item.path);
            }
          }}
        >
          <span>
            <FontAwesomeIcon icon={item.icon} className="me-2 fa-icon" />
            {item.title}
          </span>
          {hasSubItems && (
            <span className="ms-2">
              {expandedItems[item.id] ? '▼' : '▶'}
            </span>
          )}
        </NavLink>
  
        {hasSubItems && (
          <Collapse isOpen={expandedItems[item.id]}>
            <Nav vertical className="sub-items"> {/* Utiliza la clase sub-items aquí */}
              {item.subItems.map(subItem => (
                <NavItem key={subItem.id}>
                  <NavLink
                    className="sub-item" // Asegúrate de usar 'sub-item' aquí
                    onClick={() => onNavigate(subItem.path)}
                  >
                    <FontAwesomeIcon icon={subItem.icon} className="me-2 fa-icon" />
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
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <Button 
        color="primary" 
        className="toggle-btn"
        onClick={onToggle}
      >
        {isOpen ? '←' : '→'}
      </Button>

      <Collapse isOpen={isOpen}>
        <Nav vertical className="sidebar-nav">
          {items.map(renderMenuItem)}
        </Nav>
      </Collapse>
    </div>
  );
};

export default Sidebar;
