import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaInicial from './TelaInicial';
import CriarNovaCampanha from './CriarNovaCampanha';
import CampanhaEmAndamento from './CampanhaEmAndamento';
import { ArrecadacaoProvider } from '@/context/Arrecadacao/ArrecadacaoContext';

export default function ArrecadacaoTab({ navigation, route }: { navigation: any; route: any }) {
    const Stack = createNativeStackNavigator();
    return (
        <ArrecadacaoProvider>
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
            </Stack.Navigator>
        </ArrecadacaoProvider>
    );
}
