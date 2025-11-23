import { useState } from "react";

export default function ImportCsvCard({ onSelect, onConfirm }) {
  const [file, setFile] = useState(null);

  function handleChange(e) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    onSelect?.(f);
  }

  return (
    <div className="card">
      <div className="px-4 py-3 border-b">
        <p className="font-semibold">Importar Inscritos CSV</p>
      </div>

      <div className="p-4 flex items-center gap-3">
        {/* input oculto */}
        <input
          id="fileInput"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />

        {/* botón personalizado */}
        <label
          htmlFor="fileInput"
          className="btn cursor-pointer"
        >
          Subir archivo
        </label>

        {/* nombre del archivo seleccionado */}
        <span className="text-sm text-gray-600">
          {file ? file.name : "Ningún archivo seleccionado"}
        </span>

        {/* botón de confirmación */}
        <button
          className={`btn btn-primary ${!file ? "opacity-60 cursor-not-allowed" : ""}`}
          onClick={() => file && onConfirm(file)}
          disabled={!file}
        >
          Confirmar importación
        </button>
      </div>
    </div>
  );
}
