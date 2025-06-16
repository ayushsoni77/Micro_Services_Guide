import React from 'react';
import { useApp } from '../../context/AppContext';
import Dashboard from '../Sections/Dashboard';
import PhaseSection from '../Sections/PhaseSection';
import CodeExamples from '../Sections/CodeExamples';
import Architecture from '../Sections/Architecture';
import Calculator from '../Sections/Calculator';
import Troubleshooting from '../Sections/Troubleshooting';

const MainContent: React.FC = () => {
  const { state } = useApp();

  const renderSection = () => {
    switch (state.currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'phase-1':
        return <PhaseSection phaseId={1} />;
      case 'phase-2':
        return <PhaseSection phaseId={2} />;
      case 'phase-3':
        return <PhaseSection phaseId={3} />;
      case 'phase-4':
        return <PhaseSection phaseId={4} />;
      case 'phase-5':
        return <PhaseSection phaseId={5} />;
      case 'phase-6':
        return <PhaseSection phaseId={6} />;
      case 'code-examples':
        return <CodeExamples />;
      case 'architecture':
        return <Architecture />;
      case 'calculator':
        return <Calculator />;
      case 'troubleshooting':
        return <Troubleshooting />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="main-content">
      {renderSection()}
    </main>
  );
};

export default MainContent;