export type RelatorioCategoriaType = {
    categoria: string;
    qtd_total: number;
    peso_total: number;
    medida: string;
};

export type ResumoCampanhaType = {
    id_campanha: string;
    label: string;
    data_inicio: string;
    data_fim: string | null;
    relatorio_categorias: RelatorioCategoriaType[];
};
