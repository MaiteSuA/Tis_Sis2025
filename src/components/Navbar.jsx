import logo from "../assets/logo.jpg";   // <--- Importa la imagen

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__left">
        <img src={logo} alt="OhSanSi" className="nav__logo" />
        <span className="nav__brand">OhSanSi</span>
      </div>

      <nav className="nav__links">
        <a href="/">Inicio</a>
        <a href="/evaluadores">Evaluadores</a>
        <a href="/resultados">Resultados</a>
        <a href="/medallero">Medallero</a>
      </nav>

      <div className="nav__right">
        <button className="btn btn--outline">Iniciar Sesión</button>
      </div>
    </header>
  );
}
