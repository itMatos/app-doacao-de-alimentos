export type ProdutoUpdateType = {
    nome_antigo: string;
    nome: string;
    descricao?: string;
    quantidade_estoque: number;
    preco: number;
    eh_combo: boolean;
    key_img?: string;
};

export type ProdutoEncontradoApiType = {
    gtin: string;
    id_produto_categoria: string | "";
    codigo_ncm: string | "";
    medida_por_embalagem: string | "";
    produto_medida_sigla: string | "";
    produto_marca: string | "";
    nome: string | "";
    nome_sem_acento: string | "";
};

export type ProdutoType = {
    codigoDeBarras: string;
    categoriaId: string;
    codigoNCM: string;
    quantidadePorEmbalagem: string;
    siglaMedida: string;
    marca: string;
    nome: string;
    nomeSemAcento: string;
};

export type ArrecadacaoType = {
    id_campanha: number;
    id_produto: string;
    qtd_total: number;
}

export type CategoriaType = {
    nome_categoria: string;
    medida_sigla: string; 
}
