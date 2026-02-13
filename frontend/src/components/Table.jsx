export default function Table({ headers, rows, loading = false }) {
  if (loading) {
    return <div className="text-center py-10 text-slate-500">Memuat data...</div>
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white/65 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/70">
      <table className="w-full text-left text-sm min-w-[640px]">
        <thead className="bg-slate-100/70 border-b border-slate-200/80">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-slate-700 font-semibold whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-500">
                Tidak ada data
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-200/50 hover:bg-teal-50/40 transition-all duration-300 ease-out">
                {Object.values(row).map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3 text-slate-700 transition-colors duration-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
