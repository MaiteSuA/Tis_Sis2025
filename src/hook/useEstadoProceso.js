// src/hooks/useEstadoProceso.js
import { useEffect, useState } from "react";

export const PROCESS_KEY = "ohsansi_estado_proceso_v2";

export const FASES = {
  CLASIFICATORIA: "CLASIFICATORIA",
  FINAL: "FINAL",
  CONCLUIDO: "CONCLUIDO",
};

export function useEstadoProceso() {
  const [fase, setFase] = useState(FASES.CLASIFICATORIA);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROCESS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.fase && Object.values(FASES).includes(parsed.fase)) {
        setFase(parsed.fase);
      }
    } catch (e) {
      console.error("Error leyendo estado de proceso:", e);
    }

    // (Opcional) escuchar cambios de localStorage si tienes varias tabs abiertas
    const handler = (ev) => {
      if (ev.key === PROCESS_KEY && ev.newValue) {
        try {
          const parsed = JSON.parse(ev.newValue);
          if (parsed?.fase && Object.values(FASES).includes(parsed.fase)) {
            setFase(parsed.fase);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  let label = "Fase clasificatoria";
  if (fase === FASES.FINAL) label = "Fase final";
  if (fase === FASES.CONCLUIDO) label = "Concluido";

  return {
    fase,
    label,
    isClasificatoria: fase === FASES.CLASIFICATORIA,
    isFinal: fase === FASES.FINAL,
    isConcluido: fase === FASES.CONCLUIDO,
  };
}
