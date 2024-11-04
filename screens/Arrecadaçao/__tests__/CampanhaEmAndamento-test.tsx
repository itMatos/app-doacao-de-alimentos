import { render, screen } from '@testing-library/react-native';
import { expect, jest, test } from '@jest/globals';
import CampanhaEmAndamento from '../CampanhaEmAndamento';

describe('<CampanhaEmAndamento />', () => {
    test('Texto informativo é renderizado corretamente.', async () => {
        const navigation = {
            navigate: jest.fn(),
        };
        render(<CampanhaEmAndamento navigation={navigation} route={jest.fn()} />);

        const register = screen.getByText('Registrar doação');
        const scanner = screen.getByText('Escanear código de barras');
        expect(register).toBeDefined();
        expect(scanner).toBeDefined();
    });
});
