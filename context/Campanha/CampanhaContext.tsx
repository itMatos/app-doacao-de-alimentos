import React, { createContext, useContext } from 'react';
import { useState } from 'react';


// export type dispatchType = (action: PayloadReducer) => void;

export const CampanhaContext = createContext(1);

export const CampanhaProvider = ({ children }: { children: React.ReactNode }) => {
    const [campanhaAtualId, setcampanhaAtualId] = useState(1)

    return (
        <CampanhaContext.Provider value={{campanhaAtualId, setcampanhaAtualId}}>
            {children}
        </CampanhaContext.Provider>
    );
};

