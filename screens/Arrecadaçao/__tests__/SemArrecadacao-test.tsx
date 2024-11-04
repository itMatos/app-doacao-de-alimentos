import { render, screen } from '@testing-library/react-native';
import { expect, jest, test } from '@jest/globals';
import SemArrecadacao from '../SemArrecadacao';

describe('<SemArrecadacao />', () => {
    test('Texto informativo é renderizado corretamente.', async () => {
        const navigation = {
            navigate: jest.fn(),
        };
        render(<SemArrecadacao navigation={navigation} route={jest.fn()} />);

        const semArrecadacao = screen.getByText('Sem arrecadação em andamento.');
        const crieNovaCampanha = screen.getByText(
            'Crie uma nova campanha de arrecadação para começar a registrar doações.'
        );
        expect(semArrecadacao).toBeDefined();
        expect(crieNovaCampanha).toBeDefined();
    });

    test('Botão para criar nova campanha é renderizado corretamente.', async () => {
        const navigation = {
            navigate: jest.fn(),
        };
        render(<SemArrecadacao navigation={navigation} route={jest.fn()} />);

        const button = screen.getByText('Criar nova campanha de arrecadação');
        expect(button).toBeDefined();
    });
});
