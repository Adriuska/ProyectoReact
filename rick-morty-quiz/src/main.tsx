import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

/**
 * Punto de entrada de la aplicación
 * Renderiza el componente principal App dentro de React.StrictMode
 * para detectar problemas potenciales en el código
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)