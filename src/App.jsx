import React, { useState } from 'react';
// Este es el componente principal de React
function App() {
    // El 'state' de ejemplo para el contador
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-red-500">
        <h1 class="text-3xl font-bold underline">
          Hello world!
        </h1>
      </div>    
    </>
  );
}

export default App;
