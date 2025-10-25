import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import "../styles/landing.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="hero">
        <section className="hero__headline">
          <h1>
            Sistema de<br />
            Evaluación<br />
            <span>Olimpiadas OhSanSi</span>
          </h1>
          <p className="hero__sub">NOTICIAS / PRÓXIMOS EVENTOS</p>
        </section>

        <section className="hero__carousel">
          <Carousel onNavigate={(to) => navigate(to)} />
        </section>

        <section className="hero__cta">
          <button className="btn btn--primary" onClick={() => navigate("/login")}>
            Empezar
          </button>
        </section>
      </main>
    </>
  );
}

