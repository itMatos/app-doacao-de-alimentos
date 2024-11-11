import axios from 'axios';
import config from './config';

const RotaryApi = axios.create({ baseURL: config.RotaryApi });

export async function getProductByBarCode(code: string) {
    console.log('baseurl', config.RotaryApi);

    const endpoint = `/produtos/${code}`;
    const res = await RotaryApi.get(endpoint);
    return res;
}
