import React, { createContext, useContext, useReducer } from 'react';

// Tipagem do estado do contexto
export type ArrecadacaoContextType = {
    state: ArrecadacaoInitialStateType;
    dispatch: dispatchType;
};

// Tipagem do estado inicial
export type ArrecadacaoInitialStateType = {
    arrecadacaoEmAndamento: boolean;
    idCampanhaEmAndamento: string | null;
};

// Tipagem da ação do reducer
export type PayloadReducer = {
    type: 'NovaCampanha' | 'EncerrarCampanha' | 'CampanhaEmAndamento';
    arrecadacaoEmAndamento: boolean;
    idCampanhaEmAndamento?: string; // `idCampanhaEmAndamento` pode ser opcional dependendo da ação
};

// Estado inicial do contexto
const initialState: ArrecadacaoInitialStateType = {
    arrecadacaoEmAndamento: false,
    idCampanhaEmAndamento: null,
};
export type dispatchType = (action: PayloadReducer) => void;

// Criando o contexto com a tipagem
export const ArrecadacaoContext = createContext<ArrecadacaoContextType>({
    state: initialState,
    dispatch: (() => null) as dispatchType, // Garantindo que `dispatch` é uma função válida
});

const arrecadacaoReducer = (
    state: ArrecadacaoInitialStateType,
    action: PayloadReducer
): ArrecadacaoInitialStateType => {
    switch (action.type) {
        case 'NovaCampanha':
            return {
                ...state,
                arrecadacaoEmAndamento: action.arrecadacaoEmAndamento,
                idCampanhaEmAndamento: action.idCampanhaEmAndamento ?? null,
            };
        case 'EncerrarCampanha':
            return {
                ...state,
                arrecadacaoEmAndamento: action.arrecadacaoEmAndamento,
                idCampanhaEmAndamento: null,
            };
        case 'CampanhaEmAndamento':
            return {
                ...state,
                arrecadacaoEmAndamento: action.arrecadacaoEmAndamento,
                idCampanhaEmAndamento: action.idCampanhaEmAndamento ?? null,
            };
        default:
            return state;
    }
};

export const ArrecadacaoProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(arrecadacaoReducer, initialState);

    return (
        <ArrecadacaoContext.Provider value={{ state, dispatch }}>
            {children}
        </ArrecadacaoContext.Provider>
    );
};
