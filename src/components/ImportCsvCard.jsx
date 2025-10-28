export default function ImportCsvCard({ onUpload, onConfirm }) {
  return (
    <div className="card">
      <div className="px-4 py-3 border-b">
        <p className="font-semibold">Importar Inscritos CSV</p>
      </div>

      <div className="p-4 flex items-center gap-3">
        <input type="file" accept=".csv" className="input max-w-xs" onChange={onUpload} />
        <button className="btn">Subir archivo</button>
        <button className="btn btn-primary" onClick={onConfirm}>
          Confirmar importación
        </button>
      </div>
    </div>
  );
}
