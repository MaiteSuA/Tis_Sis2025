import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Buscar" }) => {
  return (
    <div className="relative w-full max-w-xs ml-auto">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        size={18}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
};

export default SearchBar;
