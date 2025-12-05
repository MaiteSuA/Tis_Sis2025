// src/components/Carousel.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import leftArrow from "../assets/izquierda.jpg";
import rightArrow from "../assets/derecha.jpg";

/**
 * Este carrusel ahora admite:
 * - image  (frontend dummy data)
 * - imagen_url (backend anuncios)
 * - title
 * - descripcion / description
 */
export default function Carousel({ items = [], intervalMs = 4500 }) {
  // Adaptamos los items para soportar ambos formatos (dummy y BD)
  const slides = useMemo(
    () =>
      items
        .filter(Boolean)
        .map((item) => ({
          image: item.image || item.imagen_url || "", // Soporta backend y estáticos
          title: item.title || item.titulo || "Sin título",
          description:
            item.description || item.contenido || item.descripcion || "",
        })),
    [items]
  );

  const [i, setI] = useState(0);
  const timer = useRef(null);
  const hover = useRef(false);

  const next = () => setI((v) => (v + 1) % slides.length);
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!slides.length) return;

    timer.current = setInterval(() => {
      if (!hover.current) next();
    }, intervalMs);

    return () => clearInterval(timer.current);
  }, [slides.length, intervalMs]);

  if (!slides.length) {
    return (
      <div className="w-full h-64 rounded-2xl bg-gray-200 grid place-items-center text-gray-500">
        Sin noticias por ahora
      </div>
    );
  }

  const s = slides[i];

  return (
    <div
      className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden bg-gray-300"
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
    >
      {/* Imagen del anuncio */}
      {s.image && (
        <>
          <img
            src={s.image}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/30" />
        </>
      )}

      {/* Texto centrado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">
        <div className="uppercase tracking-wide text-xs md:text-sm opacity-90">
          NOTICIAS / PRÓXIMOS EVENTOS
        </div>
        <h3 className="mt-2 text-xl md:text-2xl font-semibold">{s.title}</h3>
        {s.description && (
          <p className="mt-1 text-xs md:text-sm opacity-90 max-w-3xl">
            {s.description}
          </p>
        )}
      </div>

      {/* Botón izquierda */}
      <button
        aria-label="Anterior"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2
                   w-12 h-12 md:w-14 md:h-14 rounded-full
                   bg-white/90 hover:bg-white shadow
                   grid place-items-center focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        <img
          src={leftArrow}
          alt="Anterior"
          className="w-6 h-6 md:w-7 md:h-7 object-contain"
          draggable="false"
        />
      </button>

      {/* Botón derecha */}
      <button
        aria-label="Siguiente"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2
                   w-12 h-12 md:w-14 md:h-14 rounded-full
                   bg-white/90 hover:bg-white shadow
                   grid place-items-center focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        <img
          src={rightArrow}
          alt="Siguiente"
          className="w-6 h-6 md:w-7 md:h-7 object-contain"
          draggable="false"
        />
      </button>

      {/* Puntos del carrusel */}
      <div className="absolute bottom-3 w-full flex items-center justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Ir al slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition ${
              idx === i ? "bg-white" : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
