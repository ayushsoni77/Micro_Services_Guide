import React from 'react';

interface ProgressBarProps {
  percentage: number;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, animated = false }) => {
  return (
    <div className="progress-bar">
      <div 
        className={`progress-fill ${animated ? 'animate' : ''}`}
        style={{ 
          width: `${percentage}%`,
          '--progress-width': `${percentage}%`
        } as React.CSSProperties}
      />
    </div>
  );
};

export default ProgressBar;