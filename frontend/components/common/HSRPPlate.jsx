import React from 'react';

export const HSRPPlate = ({ plate = 'GJ-01-AB-1234', size = 'md', className = '' }) => {
  const sizeConfig = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-base sm:text-lg px-3.5 py-1.5 font-bold tracking-wider',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 border border-slate-300 rounded-md bg-slate-50 text-slate-800 font-mono font-semibold shadow-xs select-all ${sizeConfig[size] || sizeConfig.md} ${className}`}
    >
      <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-200/60 leading-none">
        IND
      </span>
      <span>{plate}</span>
    </div>
  );
};
