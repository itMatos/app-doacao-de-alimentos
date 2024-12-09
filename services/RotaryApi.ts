import axios, { all } from 'axios';
import config from './config';
import {
    ArrecadacaoType,
    CategoriaType,
    PostNewCampaignType,
    ProdutoEncontradoApiType,
} from '@/types/types';

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

export async function getAllCategoriesAndMeasures(): Promise<CategoriaType[]> {
    console.log('getAllCategoriesAndMeeasures', config.RotaryApi);

    const endpoint = `/categorias`;
    const res = await RotaryApi.get(endpoint).then((res) => res.data);
    return res;
}

export async function saveNewArrecadacao(newArrecadacao: ArrecadacaoType) {
    console.log('saveNewArrecadacao: ', newArrecadacao);

    const endpoint = `/arrecadacao`;
    await RotaryApi.post(endpoint, newArrecadacao);
}

export async function saveNewProduct(newProduct: ProdutoEncontradoApiType) {
    console.log('saveNewProduct: ', newProduct);

    const endpoint = `/produtos`;
    await RotaryApi.post(endpoint, newProduct);
}

export async function createNewCategory(newCategory: CategoriaType) {
    console.log('createNewCategory: ', newCategory);

    const endpoint = `/categorias`;
    await RotaryApi.post(endpoint, newCategory);
}

export async function getAllCampanhas() {
    const endpoint = `/campanhas`;
    const res = await RotaryApi.get(endpoint)
        .then((res) => res.data)
        .then((response) => response);
    return res;
}

export async function getCampanhaInProgress() {
    const endpoint = `/campanhas/in-progress`;
    const res = await RotaryApi.get(endpoint)
        .then((res) => res.data)
        .then((response) => response);
    return res;
}

export async function closeCurrentCampanha(campanhaId: string) {
    const endpoint = `/campanhas/close/${campanhaId}`;
    return await RotaryApi.patch(endpoint);
}

export async function createNewCampaign(payloadNewCampaign: PostNewCampaignType) {
    const endpoint = `/campanhas`;
    return await RotaryApi.post(endpoint, payloadNewCampaign);
}

export async function getAllCampanhasResumo() {
    const endpoint = `/campanhas/resumo/all`;
    const res = await RotaryApi.get(endpoint)
        .then((res) => res.data)
        .then((response) => response);
    return res;
}

export async function getResumoByCampanhaId(campanhaId: string) {
    const endpoint = `/campanhas/${campanhaId}/resumo`;
    const res = await RotaryApi.get(endpoint)
        .then((res) => res.data)
        .then((response) => response);
    return res;
}
