export type ProdutoUpdateType = {
    nome_antigo: string;
    nome: string;
    descricao?: string;
    quantidade_estoque: number;
    preco: number;
    eh_combo: boolean;
    key_img?: string;
};
