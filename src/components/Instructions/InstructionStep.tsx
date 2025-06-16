import React from 'react';
import CodeBlock from '../UI/CodeBlock';

interface InstructionStepProps {
  title: string;
  description: string;
  code: string;
  language: string;
}

const InstructionStep: React.FC<InstructionStepProps> = ({
  title,
  description,
  code,
  language
}) => {
  return (
    <div className="instruction-step">
      <h4>{title}</h4>
      <p>{description}</p>
      <CodeBlock code={code} filename={language} />
    </div>
  );
};

export default InstructionStep;