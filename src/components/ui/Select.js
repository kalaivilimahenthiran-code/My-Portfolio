"use client";

export default function Select({ label, options, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {label}
        </label>
      )}
      <select
        className="w-full glass bg-[#0c0c14] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 cursor-pointer"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0c0c14]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
