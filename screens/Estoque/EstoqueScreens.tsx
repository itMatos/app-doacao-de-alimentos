import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListagemEstoqueScreen from './ListagemEstoque';

export default function EstoqueTabScreens({ navigation }: { navigation: any }) {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProdutosEstoque" component={ListagemEstoqueScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ListagemEstoque" component={ListagemEstoqueScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
