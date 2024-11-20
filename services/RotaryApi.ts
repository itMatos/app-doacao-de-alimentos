import axios from 'axios';
import config from './config';

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
