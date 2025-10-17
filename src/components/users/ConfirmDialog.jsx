export default function ConfirmDialog({ open, title, message, acceptText="Confirmar", cancelText="Cancelar", onAccept, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white rounded-xl p-4 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-700">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 rounded border" onClick={onCancel}>{cancelText}</button>
          <button className="px-3 py-2 rounded bg-red-600 text-white" onClick={onAccept}>{acceptText}</button>
        </div>
      </div>
    </div>
  );
}

