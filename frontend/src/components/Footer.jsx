import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="mt-6 text-center text-gray-600">
        <p>Desarrollado por Pablo Alvarado Umaña y Yuliana Gonzalez Chaves</p>
        <p>© 2024 - Sistema de Administración de Bases de Datos</p>
        <div>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mr-2"
          >
            GitHub
          </a>
          |
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
