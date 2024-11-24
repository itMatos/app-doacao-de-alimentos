import axios from 'axios';
import config from './config';
import { CategoriaType } from '@/types/types';

const RotaryApi = axios.create({ baseURL: config.RotaryApi, withCredentials: true });

export async function getProductByBarCode(code: string) {
    console.log(`Requesting... ${config.RotaryApi}/produtos/${code}`);

    if (!code) throw new Error('Gtin esta vazio ou undefined');

    const endpoint = `/produtos/${code}`;
    const res = await RotaryApi.get(endpoint)
        .then((res) => {
            if (res.status == 404 || res === null) throw new Error('Produto Não Encontrado');
            else return res.data;
        })
        .catch((error) => {
            throw new Error(`Erro ao buscar o produto: ${error}`);
        });
    return res;
}

export async function getAllCategories() {
    const endpoint = `/categorias`;
    const res = await RotaryApi.get(endpoint)
        .then((res) => res.data)
        .then((response) =>
            response.map((category: { nome_categoria: any }) => category.nome_categoria)
        );
    return res;
}

export async function getAllProductsByCategory(category: string) {
    console.log('getAllProductsByCategory', config.RotaryApi);
    const endpoint = `/produtos/categorias/${category}`;
    const res = await RotaryApi.get(endpoint)
        .then((res) => res.data)
        .then((response) => response);
    return res;
}

export async function createNewCategory(category: CategoriaType) {
    const payload = {
        nome_categoria: category.nomeCategoria,
        medida_sigla: category.medidaSigla,
    };
    if (!category) {
        throw new Error('Categoria não informada');
    }
    const endpoint = `/categorias`;
    const res = await RotaryApi.post(endpoint, payload)
        .then((res) => res.data)
        .then((response) => response);
    return res;
}
