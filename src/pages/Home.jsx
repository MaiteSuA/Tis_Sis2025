import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";


const news = [
  { title: "Convocatoria Oficial 2025 publicada",
    description: "Revisa fechas y requisitos para las Olimpiadas OhSanSi.",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop" },
  { title: "Capacitación a Evaluadores",
    description: "Sesiones intro y rúbricas de evaluación por áreas.",
    image: "https://images.unsplash.com/photo-1523580846011-8a49fd8d1a76?q=80&w=1600&auto=format&fit=crop" },
  { title: "Clasificatorias regionales",
    description: "Cronograma y sedes confirmadas para las pruebas.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600&auto=format&fit=crop" },
];

export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* HERO esto ocupa toda la pantalla */}
      <section className="w-screen min-h-screen bg-gray-200 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-8">
          Sistema de <br className="hidden md:block" />
          Evaluacion <br className="hidden md:block" />
          Olimpiadas OhSansi
        </h1>

        {/* Carrusel centrado debajo del título */}
        <div className="w-full max-w-5xl mb-8">
          <Carousel items={news} />
        </div>

        {/* Botón “Empezar” */}
        <a
          href="/login"
          className="px-8 py-2 rounded-md !bg-gray-700 hover:!bg-gray-800 !text-white font-semibold shadow-md transition !opacity-100 relative z-10"
        >
          Empezar
        </a>
      </section>

      <footer className="w-screen bg-gray-100 py-6 text-center text-sm text-gray-500">
        © 2025 OhSanSi — Todos los derechos reservados.
      </footer>
    </div>
  );
}