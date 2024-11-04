import React, { createContext, useContext, useReducer } from 'react';

export type ArrecadacaoContextType = {
    state: any;
    dispatch: any;
};

export type ArrecadacaoInitialStateType = {
    arrecadacaoEmAndamento: boolean;
};

const ArrecadacaoContext = createContext({} as ArrecadacaoContextType);

const initialState: ArrecadacaoInitialStateType = {
    arrecadacaoEmAndamento: false,
};

export type PayloadReducer = {
    type: string;
    arrecadacaoEmAndamento: boolean;
};

const arrecadacaoReducer = (state: ArrecadacaoInitialStateType, action: PayloadReducer) => {
    switch (action.type) {
        case 'NovaCampanha':
            return {
                ...state,
                arrecadacaoEmAndamento: action.arrecadacaoEmAndamento,
            };
        case 'EncerrarCampanha':
            return {
                ...state,
                arrecadacaoEmAndamento: action.arrecadacaoEmAndamento,
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

export const useArrecadacaoContext = () => useContext(ArrecadacaoContext);
