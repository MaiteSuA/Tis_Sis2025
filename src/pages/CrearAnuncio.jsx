import { useNavigate } from "react-router-dom";

export default function CrearAnuncio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-red-600">¡CREAR ANUNCIO !</h1>
        <p className="text-gray-600 mt-2">
          Página de crear anuncio cargando correctamente
        </p>
        
        <button
          onClick={() => navigate("/ResponsableAnuncios")}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors mt-4"
        >
          Volver a Anuncios
        </button>
      </div>
    </div>
  );
}