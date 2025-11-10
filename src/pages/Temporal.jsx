// src/pages/Temporal.jsx
import { useParams } from "react-router-dom";

export default function Temporal() {
  const { slug } = useParams();
  const titulo = (slug || "").replace(/-/g, " ");
  return (
    <div className="container-app">
      <main className="flex-1">
        <div className="w-full max-w-4xl mx-auto px-4 py-10">
          <div className="card px-6 py-10 text-center">
            <h1 className="text-xl font-semibold">Vista temporal de {titulo}</h1>
          </div>
        </div>
      </main>
    </div>
  );
}
