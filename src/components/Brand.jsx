import logo from "../assets/logo-ohsansi.png";

export default function Brand() {
  return (
    <div className="flex items-center">
      <img
        src={logo}
        alt="Oh! SanSi"
        className="h-[8.9rem] w-auto object-contain" // 👈 tamaño intermedio entre h-14 y h-16
      />
    </div>
  );
}
