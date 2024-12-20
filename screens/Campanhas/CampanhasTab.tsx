import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProdutosListagemCategorias from '../Produtos/ProdutosListagemCategorias';
import ListagemCampanhas from './ListagemCampanhas';
import { CampanhaProvider } from '@/context/Campanha/CampanhaContext';

export default function CampanhasTab({ navigation, route }: { navigation: any; route: any }) {
    const Stack = createNativeStackNavigator();
    return (
        <SafeAreaProvider>
            <Stack.Navigator>
                <Stack.Screen
                    name="ListagemCampanhas"
                    component={ListagemCampanhas}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </SafeAreaProvider>
    );
}
