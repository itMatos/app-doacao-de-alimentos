import React, { createContext, useReducer } from 'react';
import { RelatorioCategoriaType, ResumoCampanhaType } from '@/screens/Campanhas/types';

export type CampanhaInitialStateType = {
    listagemCampanhas: ResumoCampanhaType[];
};

export type dispatchType = (action: PayloadReducer) => void;

export type CampanhaContextType = {
    campanhaState: CampanhaInitialStateType;
    dispatchCampanha: dispatchType;
};

const initialState: CampanhaInitialStateType = {
    listagemCampanhas: [],
};

export type PayloadReducer =
    | {
          type: 'ListarTodasCampanhas';
          listagemCampanhas: ResumoCampanhaType[];
      }
    | {
          type: 'AdicionarCampanha';
          campanha: ResumoCampanhaType;
      }
    | {
          type: 'RemoverCampanha';
          id_campanha: string;
      }
    | {
          type: 'AtualizarCampanha';
          campanhaAtualizada: ResumoCampanhaType;
      }
    | {
          type: 'AtualizarCategoriaDeCampanha';
          id_campanha: string;
          categoriaAtualizada: RelatorioCategoriaType;
      }
    | {
          type: 'EncerrarCampanha';
          id_campanha: string;
      };

const campanhaReducer = (
    state: CampanhaInitialStateType,
    action: PayloadReducer
): CampanhaInitialStateType => {
    console.log('action', action);
    console.log('state', state);
    switch (action.type) {
        case 'ListarTodasCampanhas':
            return {
                ...state,
                listagemCampanhas: action.listagemCampanhas,
            };

        case 'AdicionarCampanha':
            return {
                ...state,
                listagemCampanhas: [...state.listagemCampanhas, action.campanha],
            };

        case 'RemoverCampanha':
            return {
                ...state,
                listagemCampanhas: state.listagemCampanhas.filter(
                    (campanha) => campanha.id_campanha !== action.id_campanha
                ),
            };

        case 'AtualizarCampanha':
            return {
                ...state,
                listagemCampanhas: state.listagemCampanhas.map((campanha) =>
                    campanha.id_campanha === action.campanhaAtualizada.id_campanha
                        ? action.campanhaAtualizada
                        : campanha
                ),
            };

        case 'AtualizarCategoriaDeCampanha': {
            return {
                ...state,
                listagemCampanhas: state.listagemCampanhas.map((campanha) => {
                    if (campanha.id_campanha === action.id_campanha) {
                        // Atualiza apenas a categoria desejada
                        const novasCategorias = campanha.relatorio_categorias.map((categoria) =>
                            categoria.categoria === action.categoriaAtualizada.categoria
                                ? { ...categoria, ...action.categoriaAtualizada }
                                : categoria
                        );

                        return {
                            ...campanha,
                            relatorio_categorias: novasCategorias,
                        };
                    }
                    return campanha;
                }),
            };
        }

        case 'EncerrarCampanha':
            return {
                ...state,
                listagemCampanhas: state.listagemCampanhas.map((campanha) =>
                    campanha.id_campanha === action.id_campanha
                        ? { ...campanha, data_fim: new Date().toISOString() }
                        : campanha
                ),
            };

        default:
            return state;
    }
};

export const CampanhaContext = createContext<CampanhaContextType>({
    campanhaState: initialState,
    dispatchCampanha: (() => null) as dispatchType,
});

export const CampanhaProvider = ({ children }: { children: React.ReactNode }) => {
    const [campanhaState, dispatchCampanha] = useReducer(campanhaReducer, initialState);

    return (
        <CampanhaContext.Provider value={{ campanhaState, dispatchCampanha }}>
            {children}
        </CampanhaContext.Provider>
    );
};
