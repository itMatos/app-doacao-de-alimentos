import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Appbar, Button, Text } from 'react-native-paper';
import { CameraType, CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { vh } from '@/utils/utils';
import { ProdutoEncontradoApiType } from '@/types/types';
import ModalRegistroDeDoacao from './ModalRegistroDeDoacao';
import { getProductByBarCode } from '@/services/RotaryApi';
import RegistrarManualmente from './RegistrarManualmente';
import ModalProductNotFound from './ModalProductNotFound';

export default function RegistrarDoacao({ navigation, route }: { navigation: any; route: any }) {
    // Estados relacionados à câmera
    const [cameraType, setCameraType] = useState<CameraType>('back');
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [isCameraActive, setCameraActive] = useState(true);

    // Funções de controle da câmera
    const activateCamera = () => setCameraActive(true);
    const deactivateCamera = () => setCameraActive(false);

    // Estados relacionados à funcionalidade
    const [isLoading, setLoading] = useState(false);
    const [isManualEntry, setManualEntry] = useState(false);
    const [isModalProdutoNaoEncontradoVisible, setModalProdutoNaoEncontradoVisible] =
        useState(false);

    // Dados do produto
    const [product, setProduct] = useState<ProdutoEncontradoApiType>();
    const [scannedBarcode, setScannedBarcode] = useState<string>('');

    // Modal de sucesso
    const [isModalProdutoEncontradoVisible, setModalProdutoEncontradoVisible] = useState(false);

    // Funções para lidar com modais
    const showModalProdutoEncontrado = () => setModalProdutoEncontradoVisible(true);
    const hideModalProdutoEncontrado = () => {
        setModalProdutoEncontradoVisible(false);
        activateCamera();
    };

    const showModalProdutoNaoEncontrado = () => setModalProdutoNaoEncontradoVisible(true);
    const hideModalProdutoNaoEncontrado = () => {
        activateCamera();
        setModalProdutoNaoEncontradoVisible(false);
    };

    // Controle de entrada manual
    const enableManualEntry = () => setManualEntry(true);
    const disableManualEntry = () => setManualEntry(false);

    // Lógica de busca de produto
    const handleBarcodeScan = (barcode: BarcodeScanningResult) => {
        deactivateCamera();
        const code = barcode.data;
        setScannedBarcode(code);
        fetchProductFromDatabase(code);
    };

    const fetchProductFromDatabase = async (barcode: string) => {
        setLoading(true);
        try {
            const response = await getProductByBarCode(barcode);
            setProduct(response);
            showModalProdutoEncontrado();
        } catch (error: any) {
            showModalProdutoNaoEncontrado();
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.navigate('ArrecadacaoTelaInicial')} />
                <Appbar.Content title="Registrar Doação" />
            </Appbar.Header>

            <View style={styles.container}>
                {!cameraPermission?.granted ? (
                    <View style={styles.permissionContainer}>
                        <Text style={styles.message}>
                            É necessário conceder permissão para acessar a câmera.
                        </Text>
                        <Button onPress={requestCameraPermission} mode="contained">
                            Conceder Permissão
                        </Button>
                    </View>
                ) : (
                    <>
                        {isCameraActive && !isManualEntry && (
                            <View style={styles.cameraContainer}>
                                <Text style={styles.messageCamera}>
                                    Aponte a câmera para o código de barras
                                </Text>
                                <CameraView
                                    style={styles.camera}
                                    facing={cameraType}
                                    barcodeScannerSettings={{
                                        barcodeTypes: ['ean13', 'ean8'],
                                    }}
                                    onBarcodeScanned={handleBarcodeScan}
                                />
                                {isLoading && (
                                    <>
                                        <ActivityIndicator animating />
                                        <Text style={styles.message}>Buscando produto...</Text>
                                    </>
                                )}
                                <Button
                                    mode="contained"
                                    style={styles.manualEntryButton}
                                    onPress={enableManualEntry}
                                    disabled={isLoading}
                                >
                                    Inserir Código Manualmente
                                </Button>
                            </View>
                        )}

                        {isManualEntry && (
                            <RegistrarManualmente
                                hideManualRegister={disableManualEntry}
                                searchProductInDatabase={fetchProductFromDatabase}
                                isLoading={isLoading}
                            />
                        )}
                    </>
                )}

                <ModalProductNotFound
                    visible={isModalProdutoNaoEncontradoVisible}
                    hideModalProductNotFound={hideModalProdutoNaoEncontrado}
                    isLoading={isLoading}
                    code={scannedBarcode}
                    navigation={navigation}
                />

                {product && (
                    <ModalRegistroDeDoacao
                        visible={isModalProdutoEncontradoVisible}
                        hideModal={hideModalProdutoEncontrado}
                        isLoading={isLoading}
                        produto={product as ProdutoEncontradoApiType}
                    />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
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
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    manualEntryButton: {
        margin: 20,
        borderRadius: 10,
    },
});
