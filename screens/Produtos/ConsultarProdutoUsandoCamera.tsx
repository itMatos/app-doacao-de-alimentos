import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Appbar, Button, Text, Title } from 'react-native-paper';
import { BarcodeScanningResult, CameraType, CameraView } from 'expo-camera';
import { vh } from '@/utils/utils';
import { getProductByBarCode } from '@/services/RotaryApi';
import { ProdutoEncontradoApiType } from '@/types/types';
import DetalhesDoProduto from './DetalhesDoProduto';

// objeto para teste sem precisar utilizar api
// const produtoTesteApiResult: ProdutoEncontradoApiType = {
//     gtin: '7893500020134',
//     id_produto_categoria: 'Arroz',
//     codigo_ncm: '10063021',
//     medida_por_embalagem: '2',
//     produto_medida_sigla: '',
//     produto_marca: 'NÃO INFORMADO',
//     nome: 'Arroz Polido Tipo 1 Tio JoÃ£o 100 GrÃ£os Nobres Pacote 2kg',
//     nome_sem_acento: 'Arroz Polido Tipo 1 Tio Joao 100 Graos Nobres Pacote 2kg',
// };

export default function ConsultarProdutoUsandoCamera({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const [visibleCamera, setVisibleCamera] = useState(true);
    const [productDetails, setProductDetails] = useState<ProdutoEncontradoApiType | null>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [showModalProductDetails, setShowModalProductDetails] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [isLoadingProductInfo, setIsLoadingProductInfo] = useState(false);
    const showLoadingProductInfo = () => setIsLoadingProductInfo(true);
    const hideLoadingProductInfo = () => setIsLoadingProductInfo(false);

    const showCamera = () => setVisibleCamera(true);
    const hideCamera = () => setVisibleCamera(false);
    const handleBarCodeScanned = (barcode: BarcodeScanningResult) => {
        showLoadingProductInfo();
        hideCamera();
        const code = barcode.data;
        searchProductInDatabase(code);
    };

    const hideModalAndShowCamera = () => {
        setShowModalProductDetails(false);
        showCamera();
    };

    const searchProductInDatabase = async (code: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
            setIsLoadingProductInfo(true);
            const response = await getProductByBarCode(code);
            // const mockResponse = produtoTesteApiResult;
            setProductDetails(response);
            setShowModalProductDetails(true);
            // hideModalProductNotFound();
        } catch (error: any) {
            console.log('error', error);
            setErrorMessage('Produto não encontrado. Tente novamente ou registre o produto.');
            // showModalProductNotFound();
        } finally {
            setIsLoadingProductInfo(false);
            hideLoadingProductInfo();
        }
    };

    const goBackToProductsList = () => {
        navigation.navigate('ProdutosListagemCategorias');
    };

    //TODO - mostrar mensagem clara de produto nao encontrado

    return (
        <>
            <StatusBar barStyle="dark-content" />

            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction
                    onPress={() => navigation.navigate('ProdutosListagemCategorias')}
                />
                <Appbar.Content title="Consultar produto" />
            </Appbar.Header>
            {errorMessage.trim() !== '' && (
                <View style={styles.content}>
                    <Title>{errorMessage}</Title>
                    <Button
                        onPress={() => navigation.navigate('CadastrarNovoProduto')}
                        mode="contained"
                        style={{ marginTop: 10 }}
                    >
                        Registrar novo produto
                    </Button>
                </View>
            )}
            {visibleCamera && (
                <CameraView
                    facing={facing}
                    barcodeScannerSettings={{
                        barcodeTypes: ['ean13', 'ean8'],
                    }}
                    style={{ width: '100%', height: 100 * vh }}
                    onBarcodeScanned={handleBarCodeScanned}
                >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => {}}>
                            <Text style={styles.text}>{''}</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}

            {isLoadingProductInfo && (
                <View style={styles.content}>
                    <ActivityIndicator animating={true} style={{ marginVertical: 10 }} />

                    <Title>Buscando informações do produto...</Title>
                </View>
            )}

            {!visibleCamera && productDetails !== null && (
                <DetalhesDoProduto
                    visible={showModalProductDetails}
                    hideModal={() => hideModalAndShowCamera()}
                    isLoading={isLoadingProductInfo}
                    produto={productDetails}
                    goBackToProductsList={goBackToProductsList}
                    showCloseDetailsButton={false}
                    removeProductFromList={() => {}}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
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
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    iconButton: {
        height: 150,
        width: 150,
        borderRadius: 100,
    },
    scanButton: {
        width: '80%',
        margin: 20,
        borderRadius: 10,
    },
    title: {
        margin: 5,
    },
});
