import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, Modal, TouchableOpacity } from 'react-native';
import { Appbar, Button, Portal, Surface, Text, TextInput } from 'react-native-paper';
import { CameraType, CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { vh } from '@/utils/utils';
import { ProdutoEncontradoApiType } from '@/types/types';
import ModalRegistroDeDoacao from './ModalRegistroDeDoacao';
import { getProductByBarCode } from '@/services/RotaryApi';

export default function RegistrarManualmente({
    hideManualRegister,
    simulateRequest,
    searchProductInDatabase,
}: {
    hideManualRegister: () => void;
    simulateRequest: () => void;
    searchProductInDatabase: (code: string) => void;
}) {
    const [code, setCode] = useState('');

    const handleSearchProduct = async () => {
        const code = '123456789';
        const product = await getProductByBarCode(code);
        console.log(product);
        // TODO: Implementar a lógica de captura de código de barras
        // searchProductInDatabase (code)
    };

    const handleBarCodeInput = (code: string) => {
        console.log('code', code);
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
                        onPress={() => {
                            {
                                simulateRequest();
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
