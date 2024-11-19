import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProdutosListagemCategorias from './ProdutosListagemCategorias';
import ConsultarProdutoUsandoCamera from './ConsultarProdutoUsandoCamera';

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
                {/* <Stack.Screen
                        name="CriarNovaCampanha"
                        component={CriarNovaCampanha}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="CampanhaEmAndamento"
                        component={CampanhaEmAndamento}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="RegistrarDoacao"
                        component={RegistrarDoacao}
                        options={{ headerShown: false }}
                    /> */}
            </Stack.Navigator>
        </SafeAreaProvider>
    );
}
