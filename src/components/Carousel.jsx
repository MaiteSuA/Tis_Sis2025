import { useEffect, useRef, useState } from "react";
import "../styles/landing.css";

const SLIDES = [
  {
    id: 1,
    title: "Inscripciones abiertas",
    text: "Postúlate a tu área favorita y revisa el cronograma.",
    img: "/news/n1.jpg",
    cta: { label: "Ver cronograma", to: "/resultados" }
  },
  {
    id: 2,
    title: "Convocatoria de evaluadores",
    text: "Únete como evaluador y contribuye a la Olimpiada.",
    img: "/news/n2.jpg",
    cta: { label: "Postularme", to: "/evaluadores" }
  },
  {
    id: 3,
    title: "Eventos próximos",
    text: "Charlas y prácticas de preparación, ¡no te las pierdas!",
    img: "/news/n3.jpg",
    cta: { label: "Ver eventos", to: "/medallero" }
  }
];

export default function Carousel({ onNavigate }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const go = (next) => {
    setIdx((i) => (i + next + SLIDES.length) % SLIDES.length);
  };

  const goto = (i) => setIdx(i);

  useEffect(() => {
    // autoplay
    timerRef.current = setInterval(() => go(1), 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="carousel">
      <button className="carousel__arrow" onClick={() => go(-1)}>‹</button>

      <div className="carousel__slide">
        <img className="carousel__img" src={SLIDES[idx].img} alt={SLIDES[idx].title} />
        <div className="carousel__caption">
          <h3>{SLIDES[idx].title}</h3>
          <p>{SLIDES[idx].text}</p>
          <button
            className="btn"
            onClick={() => onNavigate?.(SLIDES[idx].cta.to)}
          >
            {SLIDES[idx].cta.label}
          </button>
        </div>
      </div>

      <button className="carousel__arrow" onClick={() => go(1)}>›</button>

      <div className="carousel__dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className={`dot ${i === idx ? "dot--active" : ""}`}
            onClick={() => goto(i)}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

