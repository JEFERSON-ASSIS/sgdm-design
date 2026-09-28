import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilo.css';
import { Catalogo } from './Catalogo';

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <Catalogo />
  </StrictMode>,
);
