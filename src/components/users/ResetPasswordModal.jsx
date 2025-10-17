export default function ResetPasswordModal({ open, email, tempPass, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white rounded-xl p-4 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Contraseña temporal generada</h3>
        <p className="text-sm mb-3">Para: <b>{email}</b></p>
        <div className="bg-gray-100 rounded p-3 font-mono select-all">{tempPass || "********"}</div>
        <div className="mt-4 flex justify-end">
          <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={onClose}>Entendido</button>
        </div>
      </div>
    </div>
  );
}

