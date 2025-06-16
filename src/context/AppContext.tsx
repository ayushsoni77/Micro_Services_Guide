import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Phase {
  id: number;
  name: string;
  tasks: number;
}

export interface AppState {
  currentSection: string;
  completedTasks: Set<string>;
  totalTasks: number;
  phases: Phase[];
  isMobileMenuOpen: boolean;
}

type AppAction =
  | { type: 'SET_CURRENT_SECTION'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'CLOSE_MOBILE_MENU' };

const initialState: AppState = {
  currentSection: 'dashboard',
  completedTasks: new Set(),
  totalTasks: 42,
  phases: [
    { id: 1, name: 'Project Setup & Planning', tasks: 5 },
    { id: 2, name: 'Infrastructure as Code', tasks: 6 },
    { id: 3, name: 'Microservices Development', tasks: 7 },
    { id: 4, name: 'Containerization', tasks: 6 },
    { id: 5, name: 'Kubernetes Deployment', tasks: 7 },
    { id: 6, name: 'CI/CD Pipeline', tasks: 7 }
  ],
  isMobileMenuOpen: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_SECTION':
      return {
        ...state,
        currentSection: action.payload,
        isMobileMenuOpen: false
      };
    case 'TOGGLE_TASK': {
      const newCompletedTasks = new Set(state.completedTasks);
      if (newCompletedTasks.has(action.payload)) {
        newCompletedTasks.delete(action.payload);
      } else {
        newCompletedTasks.add(action.payload);
      }
      return {
        ...state,
        completedTasks: newCompletedTasks
      };
    }
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        isMobileMenuOpen: !state.isMobileMenuOpen
      };
    case 'CLOSE_MOBILE_MENU':
      return {
        ...state,
        isMobileMenuOpen: false
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getPhaseCompletionCount: (phaseId: number) => number;
  getProgressPercentage: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const getPhaseCompletionCount = (phaseId: number): number => {
    let count = 0;
    state.completedTasks.forEach(taskId => {
      if (taskId.startsWith(`task-${phaseId}-`)) {
        count++;
      }
    });
    return count;
  };

  const getProgressPercentage = (): number => {
    return (state.completedTasks.size / state.totalTasks) * 100;
  };

  const value = {
    state,
    dispatch,
    getPhaseCompletionCount,
    getProgressPercentage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}