"use client";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

export default function DataTable({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white/[0.02] rounded-xl border border-white/5">
        No records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0c0c14]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 text-sm font-semibold text-gray-300">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-white/[0.02] transition-colors">
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-4 text-sm text-gray-400">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td className="px-6 py-4 text-right space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                    className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors inline-block"
                  >
                    <HiOutlinePencil size={18} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors inline-block"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
