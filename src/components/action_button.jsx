import { Pencil, Save, Send } from "lucide-react";

const ActionButton = ({ type = "edit", label, onClick, disabled = false }) => {
  const variants = {
    edit: {
      icon: <Pencil size={16} />,
      className:
        "bg-white hover:bg-gray-100 text-black border border-gray-300",
    },
    save: {
      icon: <Save size={16} />,
      className:
        "bg-white hover:bg-gray-100 text-black border border-gray-300",
    },
    export: {
      icon: <Send size={16} />,
      className:
        "bg-black hover:bg-gray-800 text-white border border-transparent",
    },
  };

  const { icon, className } = variants[type] || variants.edit;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      type="button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;