import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProdutosListagemCategorias from './ProdutosListagemCategorias';
import ConsultarProdutoUsandoCamera from './ConsultarProdutoUsandoCamera';
import ProdutosPorCategoria from './ProdutosPorCategoria';
import CadastrarNovoProduto from './CadastrarNovoProduto';

export default function ProdutosTab({ navigation, route }: { navigation: any; route: any }) {
    const Stack = createNativeStackNavigator();
    return (
        <SafeAreaProvider>
            <Stack.Navigator>
                <Stack.Screen
                    name="ProdutosListagemCategorias"
                    component={ProdutosListagemCategorias}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ConsultarUsandoCamera"
                    component={ConsultarProdutoUsandoCamera}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ProdutosPorCategoria"
                    component={ProdutosPorCategoria}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CadastrarNovoProduto"
                    component={CadastrarNovoProduto}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </SafeAreaProvider>
    );
}
