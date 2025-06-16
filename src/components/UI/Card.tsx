import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card__body">
        {children}
      </div>
    </div>
  );
};

export default Card;