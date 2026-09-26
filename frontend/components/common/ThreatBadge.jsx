import React from 'react';

export const ThreatBadge = ({ level = 'CLEAR', size = 'sm', showIcon = true }) => {
  const getBadgeConfig = () => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          dot: 'bg-red-600',
          label: 'CRITICAL',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          dot: 'bg-orange-600',
          label: 'HIGH THREAT',
        };
      case 'MEDIUM':
      case 'WARNING':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          dot: 'bg-amber-500',
          label: 'MEDIUM',
        };
      case 'INFO':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          dot: 'bg-blue-600',
          label: 'INFO',
        };
      case 'CLEAR':
      default:
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'CLEAR',
        };
    }
  };

  const config = getBadgeConfig();
  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-1.5 py-0.5' 
    : size === 'md' 
    ? 'text-xs px-2.5 py-1 font-medium' 
    : 'text-xs px-2 py-0.5 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showIcon && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
