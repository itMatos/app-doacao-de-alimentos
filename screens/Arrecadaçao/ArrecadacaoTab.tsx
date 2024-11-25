import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaInicial from './TelaInicial';
import CriarNovaCampanha from './CriarNovaCampanha';
import CampanhaEmAndamento from './CampanhaEmAndamento';
import { ArrecadacaoProvider } from '@/context/Arrecadacao/ArrecadacaoContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RegistrarDoacao from './RegistrarDoacao';
import { CampanhaProvider } from '@/context/Campanha/CampanhaContext';

export default function ArrecadacaoTab({ navigation, route }: { navigation: any; route: any }) {
    const Stack = createNativeStackNavigator();
    return (
        <CampanhaProvider>
            <ArrecadacaoProvider>
                <SafeAreaProvider>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="ArrecadacaoTelaInicial"
                            component={TelaInicial}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
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
                        />
                    </Stack.Navigator>
                </SafeAreaProvider>
            </ArrecadacaoProvider>
        </CampanhaProvider>
    );
}
