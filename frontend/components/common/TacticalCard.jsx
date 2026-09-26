import React from 'react';

export const TacticalCard = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  children,
  className = '',
  bodyClassName = '',
  hover = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-xl shadow-xs transition-all duration-200 ${
        hover ? 'hover:shadow-sm hover:border-slate-300 cursor-pointer' : ''
      } ${className}`}
    >
      {(title || subtitle || Icon || badge || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {badge && <div>{badge}</div>}
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}

      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
