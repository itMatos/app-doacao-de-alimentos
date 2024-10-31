import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaInicial from './TelaInicial';
import NovaCampanha from './NovaCampanha';

export default function ArrecadacaoTab({ navigation }: { navigation: any }) {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator>
            {/* <Stack.Screen
                name="ArrecadacaoTelaInicial"
                component={TelaInicial}
                options={{ headerShown: false }}
            /> */}
            <Stack.Screen
                name="CriarNovaCampanha"
                component={NovaCampanha}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
