import { render, waitFor, screen } from '@testing-library/react-native';
import { expect, jest, test } from '@jest/globals';
import TelaInicial from '@/screens/Arrecadaçao/TelaInicial';
import { Appbar } from 'react-native-paper';
import { View, ViewProps } from 'react-native';
import { JSX } from 'react';

describe('<TelaInicial />', () => {
    test('Text renders correctly on HomeScreen', async () => {
        render(<TelaInicial />);
        const message = screen.getByText('Sem arrecadação em andamento.');
        expect(message).toBeDefined();
    });
});
