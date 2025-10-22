import { Trash2, Plus } from "lucide-react";

const ExcelGrid = ({
  columns,
  data,
  onCellChange,
  onDeleteRow,
  onAddRow, 
  renderCell,
  showRowNumbers = true,
  showActions = true,
  minOneRow = true,
  className = "",
  rowClassName = () => "",
}) => {
  return (
    <div className={`bg-white shadow-sm border border-gray-300 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {showRowNumbers && (
                <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 text-center w-12">
                  Nº
                </th>
              )}

              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`border border-gray-300 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  } ${col.width || ""}`}
                >
                  {col.header}
                </th>
              ))}

              {showActions && (
                <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 text-center w-24">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className={`hover:bg-blue-50 transition-colors ${rowClassName(row, rowIndex)}`}
              >
                {/* N° */}
                {showRowNumbers && (
                  <td className="border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-600 font-medium text-center">
                    {rowIndex + 1}
                  </td>
                )}

                {/* Celdas */}
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-0">
                    {renderCell
                      ? renderCell(row, col, rowIndex, colIndex, onCellChange)
                      : (
                        <input
                          type="text"
                          value={row[col.field] || ""}
                          onChange={(e) => onCellChange(row.id, col.field, e.target.value)}
                          placeholder={col.placeholder || ""}
                          className="w-full h-full px-2 py-1.5 text-sm border-none focus:ring-2 focus:ring-blue-500 focus:ring-inset outline-none bg-transparent"
                        />
                      )}
                  </td>
                ))}

                {/* Acciones */}
                {showActions && (
                  <td className="border border-gray-300 bg-gray-50 text-center">
                    <div className="inline-flex items-center gap-2 p-1">
                      {/* Eliminar */}
                      <button
                        onClick={() => onDeleteRow(row.id)}
                        disabled={minOneRow && data.length === 1}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Eliminar fila"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Agregar */}
                      {rowIndex === data.length - 1 && onAddRow && (
                        <button
                          onClick={onAddRow}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-1 rounded transition-colors"
                          title="Agregar fila"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelGrid;
