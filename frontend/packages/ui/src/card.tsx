import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 transition-all hover:shadow-md ${className}`}
      {...props}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
