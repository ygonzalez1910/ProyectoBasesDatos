import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

import Respaldo from '../pages/respaldo/Respaldo';
import AdministrarRespaldo from '../pages/respaldo/AdministrarRespaldo';
import CompletoRespaldo from '../pages/respaldo/CompletoRespaldo';
import EsquemaRespaldo from '../pages/respaldo/EsquemaRespaldo';
import RecuperarRespaldo from '../pages/respaldo/RecuperarRespaldo';
import TablaRespaldo from '../pages/respaldo/TablaRespaldo';

import AdministrarTableSpace from '../pages/administrarTableSpace/AdministrarTableSpace';

import Tunning from '../pages/tunning/Tunning';

import Performance from '../pages/performance/Performace';

import Auditoria from '../pages/auditoria/auditoria';

import Seguridad from '../pages/Seguridad/Seguridad';
// Importa más páginas según necesites

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/respaldo" element={<Respaldo />} />
        <Route path="/respaldo/tabla" element={<TablaRespaldo />} />
        <Route path="/respaldo/recuperar" element={<RecuperarRespaldo />} />
        <Route path="/respaldo/administrar" element={<AdministrarRespaldo />} />
        <Route path="/respaldo/completo" element={<CompletoRespaldo/>} />
        <Route path="/respaldo/esquema" element={<EsquemaRespaldo/>} />
        
        <Route path="/administrarTableSpace" element={<AdministrarTableSpace />} />

        <Route path="/tunning/" element={<Tunning />} />

        <Route path="/performance" element={<Performance />} />

        <Route path="/auditoria" element={<Auditoria />} />

        <Route path="/seguridad" element={<Seguridad />} />
        

      {/* Agrega más rutas según necesites */}
        <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;