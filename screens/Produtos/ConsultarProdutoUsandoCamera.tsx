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
import ModalDetalhesDoProduto from './ModalDetalhesDoProduto';

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

    const [visibleCamera, setVisibleCamera] = useState(true);
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
            console.log('finally');
            hideLoadingProductInfo();
        }
    };

    return (
        <>
            {visibleCamera && (
                <CameraView
                    facing={facing}
                    barcodeScannerSettings={{
                        barcodeTypes: ['ean13', 'ean8'],
                    }}
                    style={{ zIndex: 1, width: '100%', height: 100 * vh }}
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
                <View style={styles.container}>
                    <Card>
                        <Card.Content>
                            <Title>{produtoTesteApiResult.nome_sem_acento}</Title>
                            <Paragraph>
                                <Text style={styles.label}>Categoria: </Text>
                                {produtoTesteApiResult.id_produto_categoria}
                            </Paragraph>
                            <Paragraph>
                                <Text style={styles.label}>GTIN: </Text>
                                {produtoTesteApiResult.gtin}
                            </Paragraph>
                            <Paragraph>
                                <Text style={styles.label}>Unidade de medida: </Text>
                                {produtoTesteApiResult.produto_medida_sigla ?? 'kg'}
                            </Paragraph>
                            <Paragraph>
                                <Text style={styles.label}>Medida por embalagem: </Text>
                                {produtoTesteApiResult.medida_por_embalagem}{' '}
                                {produtoTesteApiResult.produto_medida_sigla ?? 'kg'}
                            </Paragraph>
                            <Paragraph>
                                <Text style={styles.label}>Marca: </Text>
                                {produtoTesteApiResult.produto_marca}
                            </Paragraph>
                            <Paragraph>
                                <Text style={styles.label}>Código NCM: </Text>
                                {produtoTesteApiResult.codigo_ncm}
                            </Paragraph>
                        </Card.Content>
                        <Divider />
                        <Card.Actions>
                            <Button mode="outlined" onPress={() => console.log('Editar produto')}>
                                Editar
                            </Button>
                            <Button mode="contained" onPress={() => console.log('Excluir produto')}>
                                Excluir
                            </Button>
                        </Card.Actions>
                    </Card>
                    <ModalDetalhesDoProduto
                        visible={showModalProductDetails}
                        isLoading={false}
                        hideDetalhesProduto={() => setShowModalProductDetails(false)}
                        // produto={produtoTesteApiResult}
                    />
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
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
