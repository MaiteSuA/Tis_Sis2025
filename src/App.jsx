import { useState } from "react";
import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";
import StatsStrip from "./components/StatsStrip";
import ImportCsvCard from "./components/ImportCsvCard";
import DataTable from "./components/DataTable";

export default function App() {
  const [previewRows, setPreviewRows] = useState([]);
  const totals = { total: 123456, clasificados: 123456, reportes: 123456 };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Demo de previsualización
    setPreviewRows([
      { Nombres: "Ana", Apellidos: "Quispe", CI: "123", Colegio: "C1" },
      { Nombres: "Luis", Apellidos: "Mamani", CI: "456", Colegio: "C2" },
      { Nombres: "María", Apellidos: "Guzmán", CI: "789", Colegio: "C3" },
    ]);
  };

  const handleConfirm = () => {
    // aquí llamarías a tu endpoint real
    alert("Importación confirmada (simulada).");
  };

  return (
    <div className="container-app">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="w-full max-w-6xl mx-auto px-4 py-5 space-y-4">
            <h1 className="text-sm font-semibold text-gray-600">Dashboard</h1>
            <StatsStrip totals={totals} />
            <ImportCsvCard onUpload={handleUpload} onConfirm={handleConfirm} />
            <DataTable rows={previewRows} />
          </div>
        </main>
      </div>
    </div>
  );
}
