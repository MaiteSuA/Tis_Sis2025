// El hook 'useState' se usa para manejar el estado de los componentes
import { useState } from "react";
// Logos de ejemplo importados como recursos estáticos
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// El componente Link de React Router se usa para la navegación interna
import { Link } from 'react-router-dom';
// El CSS específico para este componente
import "./styles/App.css";

// Este es el componente principal de React
function App() {
    // El 'state' de ejemplo para el contador
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
          {/* Los siguientes dos enlaces y las imágenes son ejemplos de Vite */}
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
        {/* El siguiente título y tarjeta son ejemplos que puedes eliminar */}
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/*
        Este es el botón de navegación de ejemplo usando React Router.
        Se puede eliminar si no se necesita.
      */}
      {/* Botón para navegar a la nueva página */}
      <Link to="/tailwind-example">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Ver ejemplo de Tailwind
        </button>
      </Link>

    </>
  );
}

export default App;
