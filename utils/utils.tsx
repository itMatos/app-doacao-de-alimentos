import { Dimensions } from 'react-native';

export const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
];

export const vh = Dimensions.get('window').height / 100;
export const vw = Dimensions.get('window').width / 100;

export const IsNumeric = (value: string): boolean => {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    for(let i = 0; i < value.length; i++){
        if(!numbers.includes(value[i])) return false
    }

    return true
}

export const isValidNumber = (value: string) => !isNaN(+value) && isFinite(+value) && !/e/i.test(value);