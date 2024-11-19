import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function RegistrarManualmente({
    hideManualRegister,
    simulateRequest,
    searchProductInDatabase
}: {
    hideManualRegister: () => void;
    simulateRequest: () => void;
    searchProductInDatabase: (code: string) => void;
}) {
    const [code, setCode] = useState('');

    const handleBarCodeInput = (code: string) => {
        setCode(code);
    };

    return (
        <View style={{ flex: 1, marginHorizontal: 'auto' }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, padding: 20 }}>
                    <Text style={{ fontSize: 16, marginBottom: 20 }} variant="titleMedium">
                        Insira o código de barras do produto para registrar a doação manualmente
                    </Text>
                    <Text style={{ fontSize: 16, marginBottom: 10 }}>
                        Digite o código de barras
                    </Text>
                    <TextInput
                        keyboardType="numeric"
                        mode="outlined"
                        style={{
                            padding: 2,
                            marginBottom: 10,
                        }}
                        onChangeText={handleBarCodeInput}
                        placeholder="Código de barras"
                    />
                    <Button
                        icon={'magnify'}
                        mode="contained"
                        onPress={async () => {
                            {  
                                searchProductInDatabase(code)
                            }
                        }}
                        style={{ marginTop: 20 }}
                    >
                        Buscar produto (simular)
                    </Button>

                    <Button
                        icon={'camera'}
                        mode="outlined"
                        onPress={() => {
                            hideManualRegister();
                        }}
                        style={{ marginTop: 20 }}
                    >
                        Voltar para a câmera
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}
