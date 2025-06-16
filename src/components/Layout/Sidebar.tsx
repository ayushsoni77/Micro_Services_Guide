import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Code, Building, Calculator, Wrench } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { state, dispatch, getPhaseCompletionCount } = useApp();

  const handleNavigation = (sectionId: string) => {
    dispatch({ type: 'SET_CURRENT_SECTION', payload: sectionId });
  };

  const getPhaseIndicatorStyle = (phaseId: number, tasks: number) => {
    const completedTasks = getPhaseCompletionCount(phaseId);
    if (completedTasks === tasks) {
      return { backgroundColor: 'var(--color-success)', color: 'white' };
    } else if (completedTasks > 0) {
      return { backgroundColor: 'var(--color-warning)', color: 'white' };
    }
    return { backgroundColor: 'var(--color-secondary)', color: 'var(--color-text)' };
  };

  return (
    <nav className={`sidebar ${state.isMobileMenuOpen ? 'open' : ''}`}>
      <div className="sidebar__header">
        <h2>Microservices Guide</h2>
      </div>
      <div className="sidebar__nav">
        <button
          className={`nav-item ${state.currentSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigation('dashboard')}
        >
          <BarChart3 className="nav-icon" size={18} />
          Dashboard
        </button>
        
        <div className="nav-group">
          <h3>Implementation Phases</h3>
          {state.phases.map((phase) => (
            <button
              key={phase.id}
              className={`nav-item ${state.currentSection === `phase-${phase.id}` ? 'active' : ''}`}
              onClick={() => handleNavigation(`phase-${phase.id}`)}
            >
              <span 
                className="phase-indicator"
                style={getPhaseIndicatorStyle(phase.id, phase.tasks)}
              >
                {phase.id}
              </span>
              {phase.name.split(' ')[0]} {phase.name.split(' ')[1] || ''}
            </button>
          ))}
        </div>
        
        <button
          className={`nav-item ${state.currentSection === 'code-examples' ? 'active' : ''}`}
          onClick={() => handleNavigation('code-examples')}
        >
          <Code className="nav-icon" size={18} />
          Code Examples
        </button>
        
        <button
          className={`nav-item ${state.currentSection === 'architecture' ? 'active' : ''}`}
          onClick={() => handleNavigation('architecture')}
        >
          <Building className="nav-icon" size={18} />
          Architecture
        </button>
        
        <button
          className={`nav-item ${state.currentSection === 'calculator' ? 'active' : ''}`}
          onClick={() => handleNavigation('calculator')}
        >
          <Calculator className="nav-icon" size={18} />
          Cost Calculator
        </button>
        
        <button
          className={`nav-item ${state.currentSection === 'troubleshooting' ? 'active' : ''}`}
          onClick={() => handleNavigation('troubleshooting')}
        >
          <Wrench className="nav-icon" size={18} />
          Troubleshooting
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;