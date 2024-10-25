import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ArrecadacaoTelaInicial from './ArrecadacaoTelaInicial';

export default function ArrecadacaoTab({ navigation }: { navigation: any }) {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProdutosEstoque"
                component={ArrecadacaoTelaInicial}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
