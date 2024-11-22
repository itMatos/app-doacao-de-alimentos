import React, { useContext, useState } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import {
    Appbar,
    Button,
    Card,
    Divider,
    IconButton,
    Paragraph,
    Surface,
    Text,
    Title,
} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';
import ListagemCategorias from './ListagemCategorias';
import { BarcodeScanningResult, CameraType, CameraView } from 'expo-camera';
import { vh } from '@/utils/utils';
import { getProductByBarCode } from '@/services/RotaryApi';
import { ProdutoEncontradoApiType } from '@/types/types';
import DetalhesDoProduto from './DetalhesDoProduto';

// objeto para teste sem precisar utilizar api
const produtoTesteApiResult: ProdutoEncontradoApiType = {
    gtin: '7893500020134',
    id_produto_categoria: 'Arroz',
    codigo_ncm: '10063021',
    medida_por_embalagem: '2',
    produto_medida_sigla: null,
    produto_marca: 'NÃO INFORMADO',
    nome: 'Arroz Polido Tipo 1 Tio JoÃ£o 100 GrÃ£os Nobres Pacote 2kg',
    nome_sem_acento: 'Arroz Polido Tipo 1 Tio Joao 100 Graos Nobres Pacote 2kg',
};

export default function ConsultarProdutoUsandoCamera({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const { state } = useContext(ArrecadacaoContext);
    const teste = false;

    const [visibleCamera, setVisibleCamera] = useState(false);
    const [productDetails, setProductDetails] = useState<any>();
    const [facing, setFacing] = useState<CameraType>('back');
    const [showModalProductDetails, setShowModalProductDetails] = useState(true);

    const [isLoadingProductInfo, setIsLoadingProductInfo] = useState(false);
    const showLoadingProductInfo = () => setIsLoadingProductInfo(true);
    const hideLoadingProductInfo = () => setIsLoadingProductInfo(false);

    const showCamera = () => setVisibleCamera(true);
    const hideCamera = () => setVisibleCamera(false);
    const handleBarCodeScanned = (barcode: BarcodeScanningResult) => {
        showLoadingProductInfo();
        hideCamera();
        const code = barcode.data;
        console.log('code', code);
        const mockCode = '7893500020134';
        // TODO alterar para code e remover mockCode
        searchProductInDatabase(mockCode);
    };

    const hideModalAndShowCamera = () => {
        setShowModalProductDetails(false);
        showCamera();
    };

    const goBackToProductsList = () => {
        navigation.navigate('ProdutosListagemCategorias');
    };

    const searchProductInDatabase = async (code: string) => {
        // setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
            const response = await getProductByBarCode(code);
            const mockResponse = produtoTesteApiResult;
            setProductDetails(mockResponse);
            setShowModalProductDetails(true);
            // hideModalProductNotFound();
        } catch (error: any) {
            console.log('error', error);
            // showModalProductNotFound();
        } finally {
            // setIsLoading(false);
            hideLoadingProductInfo();
        }
    };

    return (
        <>
            <StatusBar barStyle="dark-content" />

            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction
                    onPress={() => navigation.navigate('ProdutosListagemCategorias')}
                />
                <Appbar.Content title="Consultar produto" />
            </Appbar.Header>
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

            {!visibleCamera && (
                <DetalhesDoProduto
                    visible={showModalProductDetails}
                    hideModal={() => hideModalAndShowCamera()}
                    isLoading={false}
                    produto={produtoTesteApiResult}
                    goBackToProductsList={goBackToProductsList}
                    showCloseDetailsButton={false}
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
