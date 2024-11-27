import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function RegistrarManualmente({
    hideManualRegister,
    simulateRequest,
    searchProductInDatabase,
    isLoading,
}: {
    hideManualRegister: () => void;
    simulateRequest: () => void;
    searchProductInDatabase: (code: string) => void;
    isLoading: boolean;
}) {
    const [codeInput, setCodeInput] = useState('');

    const handleClickSearchProductInDatabase = async () => {
        searchProductInDatabase(codeInput);
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
                        onChangeText={(text) => setCodeInput(text)}
                        placeholder="Código de barras"
                    />
                    {isLoading && (
                        <Text style={{ fontSize: 16, marginBottom: 10 }}>
                            Estamos buscando o produto...
                        </Text>
                    )}
                    <Button
                        icon={'magnify'}
                        mode="contained"
                        disabled={isLoading}
                        onPress={async () => handleClickSearchProductInDatabase()}
                        style={{ marginTop: 20 }}
                    >
                        Buscar produto
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
