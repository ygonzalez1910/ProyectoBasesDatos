import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container text-center py-3">
        <p>Desarrollado por Tu Nombre © {new Date().getFullYear()}</p>
        <p>
          <a href="https://github.com/tuusuario" target="_blank" rel="noopener noreferrer">
            GitHub
          </a> |
          <a href="https://linkedin.com/in/tuusuario" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
