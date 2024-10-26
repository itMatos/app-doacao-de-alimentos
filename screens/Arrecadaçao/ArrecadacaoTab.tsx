import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaInicial from './TelaInicial';

export default function ArrecadacaoTab({ navigation }: { navigation: any }) {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ArrecadaoTelaInicial"
                component={TelaInicial}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
