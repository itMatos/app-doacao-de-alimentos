import React, { createContext, useContext, useReducer } from 'react';
import { useState } from 'react';

// export type dispatchType = (action: PayloadReducer) => void;

export const CampanhaContext = createContext(
    {} as {
        campanhaState: CampanhaInitialStateType;
        dispatchCampanha: React.Dispatch<PayloadReducer>;
    }
);

export type CampanhaInitialStateType = {
    campanhaAtualId: number;
};

const initialState = {
    campanhaAtualId: 1,
};

export type PayloadReducer = {
    type: string;
    campanhaAtualId: number;
};

const campanhaReducer = (state: CampanhaInitialStateType, action: PayloadReducer) => {
    switch (action.type) {
        case 'NovaCampanha':
            return {
                ...state,
                campanhaAtualId: action.campanhaAtualId,
            };
        case 'EncerrarCampanha':
            return {
                ...state,
                campanhaAtualId: action.campanhaAtualId,
            };
        default:
            return state;
    }
};

export const CampanhaProvider = ({ children }: { children: React.ReactNode }) => {
    const [campanhaAtualId, setcampanhaAtualId] = useState(1);
    const [campanhaState, dispatchCampanha] = useReducer(campanhaReducer, initialState);

    return (
        <CampanhaContext.Provider value={{ campanhaState, dispatchCampanha }}>
            {children}
        </CampanhaContext.Provider>
    );
};
