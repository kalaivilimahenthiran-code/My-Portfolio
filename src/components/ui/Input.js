"use client";
import { forwardRef } from "react";

const Input = forwardRef(({ label, type = "text", error, className = "", ...props }, ref) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          ref={ref}
          className="w-full glass bg-transparent rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 resize-none min-h-[120px]"
          {...props}
        />
      ) : (
        <input
          ref={ref}
          type={type}
          className="w-full glass bg-transparent rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
          {...props}
        />
      )}
      {error && <span className="text-red-400 text-sm mt-1 block">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
