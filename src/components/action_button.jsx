const ActionButton = ({ type = "edit", label, onClick, icon }) => {
  const variants = {
    edit: "bg-white hover:bg-gray-100 text-black border border-gray-300",
    save: "bg-white hover:bg-gray-100 text-black border border-gray-300",
    export: "bg-black hover:bg-gray-800 text-white border border-transparent",
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition text-sm ${variants[type] || variants.edit}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;
