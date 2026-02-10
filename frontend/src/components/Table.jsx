export default function Table({ headers, rows, loading = false }) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50/50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-gray-700 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-gray-500">
                Tidak ada data
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-white/40 transition">
                {Object.values(row).map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3">
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
