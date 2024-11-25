import axios, { all } from 'axios';
import config from './config';
import { ArrecadacaoType, CategoriaType, ProdutoEncontradoApiType } from '@/types/types';

const RotaryApi = axios.create({ baseURL: config.RotaryApi, withCredentials: true });

export async function getProductByBarCode(code: string) {
    console.log(`Requesting... ${config.RotaryApi}/produtos/${code}`);

    if(!code) throw new Error("Gtin esta vazio ou undefined") 
    
    const endpoint = `/produtos/${code}`;
    const res = await RotaryApi.get(endpoint)
    .then(res => { 
        if(res.status == 404 || res === null) 
            throw new Error("Produto Não Encontrado"); 
        else 
        return res.data
    })
    .catch((error) => {throw new Error(`Erro ao buscar o produto: ${error}`)});
    return res;
}

export async function getAllCategories() {
    console.log('getAllCategories', config.RotaryApi);

    const endpoint = `/categorias`;
    const res = await RotaryApi.get(endpoint)
    .then(res => res.data)
    .then(response => response.map((category: { nome_categoria: any; }) => category.nome_categoria))
    return res;
}

export async function getAllCategoriesAndMeasures(): Promise<CategoriaType[]> {
    console.log('getAllCategoriesAndMeeasures', config.RotaryApi);

    const endpoint = `/categorias`;
    const res = await RotaryApi.get(endpoint)
    .then(res => res.data)
    return res;
}

export async function saveNewArrecadacao(newArrecadacao: ArrecadacaoType) {
    console.log('saveNewArrecadacao: ', newArrecadacao);

    const endpoint = `/arrecadacao`;
    await RotaryApi.post(endpoint, newArrecadacao)
}

export async function saveNewProduct(newProduct: ProdutoEncontradoApiType) {
    console.log('saveNewProduct: ', newProduct);

    const endpoint = `/produtos`;
    await RotaryApi.post(endpoint, newProduct)
}

export async function createNewCategory(newCategory: CategoriaType) {
    console.log('createNewCategory: ', newCategory);

    const endpoint = `/categorias`;
    await RotaryApi.post(endpoint, newCategory)
}