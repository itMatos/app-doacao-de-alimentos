import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, Modal, TouchableOpacity } from 'react-native';
import { Appbar, Button, Portal, Surface, Text } from 'react-native-paper';
import { CameraType, CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { vh } from '@/utils/utils';
import { ProdutoEncontradoApiType } from '@/types/types';
import ModalRegistroDeDoacao from './ModalRegistroDeDoacao';
import { getProductByBarCode } from '@/services/RotaryApi';
import axios from 'axios';
import RegistrarManualmente from './RegistrarManualmente';
import ModalCadastrarNovoProduto from './ModalCadastrarNovoProduto';

const produtoTeste: ProdutoEncontradoApiType = {
    gtin: '7897954900073',
    id_produto_categoria: 'Arroz',
    codigo_ncm: '10063021',
    medida_por_embalagem: '2',
    produto_medida_sigla: null,
    produto_marca: 'NÃO INFORMADO',
    nome: 'Arroz Minamimai Curto Japones T1 5kg',
    nome_sem_acento: 'Arroz Minamimai Curto Japones T1 5kg',
};

export default function RegistrarDoacao({ navigation, route }: { navigation: any; route: any }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [visibleModal, setVisibleModal] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [manualRegister, setManualRegister] = useState(false);
    const [visibleModalProductNotFoundVisible, setVisibleModalProductNotFound] = useState(false);

    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);

    const showCamera = () => setCameraVisible(true);
    const hideCamera = () => setCameraVisible(false);

    const showManualRegister = () => setManualRegister(true);
    const hideManualRegister = () => setManualRegister(false);

    const showModalProductNotFound = () => setVisibleModalProductNotFound(true);
    const hideModalProductNotFound = () => setVisibleModalProductNotFound(false);

    // TODO: Implementar a lógica de captura de código de barras
    // produto encontrado
    // produto nao encontrado
    // falha ao ler código de barras
    // Falha ao clicar no botao de registrar

    const simulateRequest = async () => {
        showModal();
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProduto(produtoTeste);
        setIsLoading(false);
        // return produtoTeste;
    };

    const simulateNotFound = async () => {
        showModalProductNotFound();
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    const [produto, setProduto] = useState<any | null>(null);

    const handleBarCodeScanned = (barcode: BarcodeScanningResult) => {
        const code = barcode.data;
        searchProductInDatabase(code);
    };

    const searchProductInDatabase = async (code: string) => {
        showModal();
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
            const response = await getProductByBarCode(code);
            setProduto(response);
        } catch (error: any) {
            // TODO: deve mostrar modal de registrar novo produto
            // TODO: deve mostrar o modal de cadastrar novo produto
            console.error('Erro ao buscar produto:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.navigate('ArrecadacaoTelaInicial')} />
                <Appbar.Content title="Registrar doação" />
            </Appbar.Header>
            <View style={styles.container}>
                {!permission && (
                    <View style={styles.container}>
                        <Text style={styles.message} variant="titleMedium">
                            É necessário permissão para acessar a câmera do dispositivo
                        </Text>

                        <Button
                            onPress={requestPermission}
                            mode="contained"
                            style={styles.allowCamera}
                        >
                            Conceder permissão
                        </Button>
                    </View>
                )}

                {manualRegister ? (
                    <RegistrarManualmente
                        hideManualRegister={hideManualRegister}
                        simulateRequest={simulateRequest}
                        searchProductInDatabase={searchProductInDatabase}
                    />
                ) : (
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                        }}
                    >
                        <Text style={styles.messageCamera} variant="headlineSmall">
                            Aponte a câmera do dispositivo para o código de barras
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                mode="contained"
                                onPress={() => {
                                    {
                                        simulateRequest();
                                    }
                                }}
                                style={styles.scanButton}
                            >
                                simular request
                            </Button>

                            <Button
                                mode="contained"
                                onPress={() => {
                                    {
                                        simulateNotFound();
                                    }
                                }}
                                style={styles.scanButton}
                            >
                                simular produto nao encontrado
                            </Button>
                        </View>

                        {!visibleModalProductNotFoundVisible && (
                            <CameraView
                                style={styles.camera}
                                facing={facing}
                                barcodeScannerSettings={{
                                    barcodeTypes: ['ean13', 'ean8'],
                                }}
                                onBarcodeScanned={handleBarCodeScanned}
                            >
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={() => {}}>
                                        <Text style={styles.text}>{''}</Text>
                                    </TouchableOpacity>
                                </View>
                            </CameraView>
                        )}

                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                mode="contained"
                                style={{
                                    margin: 20,
                                    borderRadius: 10,
                                }}
                                onPress={() => showManualRegister()}
                            >
                                Inserir código manualmente
                            </Button>
                        </View>
                    </View>
                )}
                {visibleModalProductNotFoundVisible && (
                    <ModalCadastrarNovoProduto
                        visible={visibleModalProductNotFoundVisible}
                        hideModalProductNotFound={hideModalProductNotFound}
                        isLoading={isLoading}
                        code={'123123123'}
                    />
                )}
                <ModalRegistroDeDoacao
                    visible={visibleModal}
                    hideModal={hideModal}
                    isLoading={isLoading}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        margin: 5,
    },
    messageCamera: {
        textAlign: 'center',
        paddingBottom: 10,
        margin: 5,
    },
    camera: {
        flex: 1,
        margin: 5,
        height: 60 * vh,
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    surface: {
        marginHorizontal: 5,
        marginVertical: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        color: 'black',
    },
    title: {
        margin: 5,
    },
    scanButton: {
        width: '80%',
        margin: 'auto',
        borderRadius: 10,
    },
    chip: {
        backgroundColor: '#81c784',
        marginVertical: 4,
    },
    surfaceStyle: {
        flex: 1,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        marginTop: 20 * vh,
        justifyContent: 'center',
    },
    allowCamera: {
        margin: 20,
        borderRadius: 10,
        backgroundColor: '#81c784',
    },
});
