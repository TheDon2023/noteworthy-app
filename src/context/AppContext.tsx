import React, { createContext, useContext, useReducer } from 'react';
import type { Message, ScenarioResult } from '@/types';

interface AppState {
  currentRole: string | null;
  currentScenario: string | null;
  messages: Message[];
  results: ScenarioResult[];
}

type AppAction =
  | { type: 'SET_ROLE'; payload: string | null }
  | { type: 'SET_SCENARIO'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SAVE_RESULT'; payload: ScenarioResult }
  | { type: 'RESET' };

const initialState: AppState = {
  currentRole: null,
  currentScenario: null,
  messages: [],
  results: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };
    case 'SET_SCENARIO':
      return { ...state, currentScenario: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'SAVE_RESULT':
      return { 
        ...state, 
        results: [...state.results.filter(r => r.scenarioId !== action.payload.scenarioId), action.payload] 
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
