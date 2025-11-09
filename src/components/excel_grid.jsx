const ExcelGrid = ({
  columns,
  data,
  onCellChange,
  renderCell,
  showRowNumbers = true,
  className = "",
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
                    col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                  } ${col.width || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex} className="hover:bg-blue-50 transition-colors">
                {showRowNumbers && (
                  <td className="border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-600 font-medium text-center">
                    {rowIndex + 1}
                  </td>
                )}

                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-0">
                    {renderCell ? (
                      renderCell(row, col, rowIndex, colIndex, onCellChange)
                    ) : (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ExcelGrid;