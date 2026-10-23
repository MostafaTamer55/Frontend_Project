import React from 'react';

/**
 * Reusable Card component aligned with Figma Design Tokens (shadow-card, rounded-card)
 */
export const Card = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-card border border-slate-200/80 shadow-card ${
        hoverable ? 'hover:shadow-card-hover hover:border-slate-300 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-5 border-b border-slate-100 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-base font-semibold text-slate-900 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-slate-500 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 bg-slate-50/60 border-t border-slate-100 rounded-b-card ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
