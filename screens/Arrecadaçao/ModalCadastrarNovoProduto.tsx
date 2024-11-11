import React, { useState } from 'react';
import { Button, Divider, Icon, IconButton, Surface, Text, TextInput } from 'react-native-paper';
import { ProdutoEncontradoApiType, ProdutoType } from '@/types/types';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import ProdutoEncontrado from './ProdutoEncontrado';
import { vh } from '@/utils/utils';
import RegistradoComSucesso from './RegistradoComSucesso';
import { Picker } from '@react-native-picker/picker';

// objeto para teste sem precisar utilizar api
const produtoTesteApiResult: ProdutoEncontradoApiType = {
    gtin: '7893500020134',
    id_produto_categoria: 'Arroz',
    codigo_ncm: '10063021',
    medida_por_embalagem: null,
    produto_medida_sigla: null,
    produto_marca: 'NÃO INFORMADO',
    nome: 'Arroz Polido Tipo 1 Tio JoÃ£o 100 GrÃ£os Nobres Pacote 2kg',
    nome_sem_acento: 'Arroz Polido Tipo 1 Tio Joao 100 Graos Nobres Pacote 2kg',
};

const mapProdutoEncontrado = (data: ProdutoEncontradoApiType): ProdutoType => ({
    codigoDeBarras: data.gtin,
    categoriaId: data.id_produto_categoria ?? 'Arroz',
    codigoNCM: data.codigo_ncm,
    quantidadePorEmbalagem: data.medida_por_embalagem ?? '1',
    siglaMedida: data.produto_medida_sigla ?? 'kg',
    marca: data.produto_marca ?? 'MARCA NÃO INFORMADA',
    nome: data.nome,
    nomeSemAcento: data.nome_sem_acento,
});

export default function ModalCadastrarNovoProduto({
    visible,
    hideModalProductNotFound,
    isLoading,
    code,
}: {
    visible: boolean;
    hideModalProductNotFound: () => void;
    isLoading: boolean;
    code: string;
}) {
    const [successRegister, setSuccessRegister] = useState(false);

    const showSuccessRegister = () => setSuccessRegister(true);
    const hideSuccessRegister = () => setSuccessRegister(false);

    const produtoFiltered = mapProdutoEncontrado(produtoTesteApiResult);

    // TODO: Implementar a lógica de captura de código de barras
    // produto encontrado: ok
    // produto nao encontrado: ok
    // falha ao ler código de barras: vai ser usado botao de inserir manualmente
    // Falha ao clicar no botao de registrar: voltar para a tela de registrar doacao

    // const [produto, setProduto] = useState<ProdutoType | null>(produtoFiltered);

    const handleClickRegisterDonation = () => {
        showSuccessRegister();
    };

    const handleClickNewRegister = () => {
        hideModalProductNotFound();
    };

    const [activeStep, setActiveStep] = useState(1);
    const [produto, setProduto] = useState({ code: '', categoria: '', descricao: '' });

    const handleNextStep = () => {
        if (activeStep < 3) setActiveStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        if (activeStep > 1) setActiveStep((prev) => prev - 1);
    };

    const handleSaveProduct = () => {
        // Lógica para salvar produto
        hideModalProductNotFound();
    };

    const renderStep = (step: number) => {
        const isActive = activeStep >= step;

        return (
            <View key={step} style={styles.stepWrapper}>
                <View style={[styles.line, isActive && styles.activeLine]} />
                <TouchableOpacity onPress={() => setActiveStep(step)} style={styles.circleWrapper}>
                    <View style={[styles.circle, isActive && styles.activeCircle]}>
                        <Text style={[styles.label, isActive && styles.activeLabel]}>{step}</Text>
                    </View>
                </TouchableOpacity>
                <View style={[styles.line, isActive && styles.activeLine]} />
            </View>
        );
    };

    const renderContent = () => {
        switch (activeStep) {
            case 1:
                return createNewProduct();
            case 2:
                return registerDonation();
            case 3:
                return <Text style={styles.card}>This is step 3 content</Text>;
            default:
                return null;
        }
    };

    const createNewProduct = () => {
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={{ alignSelf: 'center' }} variant="titleLarge">
                            Cadastre o produto
                        </Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Insira o código de barras</Text>

                        <TextInput
                            keyboardType="numeric"
                            mode="outlined"
                            onChangeText={() => {}}
                            style={styles.input}
                            placeholder="Código de barras"
                        />
                    </View>
                    {/* TODO: fazer chamada para API e ver categorias disponíveis
					TODO: criar opção de adicionar categoria */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Categoria</Text>
                        <TextInput
                            mode="outlined"
                            onChangeText={() => {}}
                            style={styles.input}
                            placeholder="Arroz"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Marca</Text>
                        <TextInput
                            mode="outlined"
                            onChangeText={() => {}}
                            style={styles.input}
                            placeholder="Descrição"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Peso da embalagem</Text>
                        <TextInput
                            mode="outlined"
                            onChangeText={() => {}}
                            style={styles.input}
                            placeholder="Peso"
                        />
                    </View>
                    {/* TODO: adicionar validação antes de poder ir para o proximo */}
                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => console.log('Próximo')}
                    >
                        Próximo
                    </Button>
                </View>
            </View>
        );
    };

    const registerDonation = () => {
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={{ alignSelf: 'center' }} variant="titleLarge">
                            Registre a doação
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Quantidade</Text>
                        <TextInput
                            mode="outlined"
                            onChangeText={() => {}}
                            style={styles.input}
                            placeholder="Peso"
                        />
                    </View>
                    <View style={[styles.header, { marginBottom: 20, alignItems: 'center' }]}>
                        <Text variant="headlineSmall" style={styles.title}>
                            Doação total
                        </Text>
                        <Text style={styles.title} variant="headlineSmall">
                            total aqui
                        </Text>
                    </View>

                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => console.log('Próximo')}
                    >
                        Próximo
                    </Button>
                </View>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={hideModalProductNotFound}
            animationType="slide"
            transparent={true}
        >
            <Surface style={styles.surfaceStyle}>
                {isLoading && <Text>Carregando...</Text>}
                {!isLoading && (
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: 5,
                        }}
                    >
                        <View style={{ alignItems: 'center', margin: 20 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 20,
                                }}
                            >
                                <Icon source="close-circle-outline" size={30} color="#d32f2f" />
                                <Text variant="titleLarge" style={{ marginHorizontal: 5 }}>
                                    Produto não encontrado!
                                </Text>
                            </View>
                            <Text variant="titleMedium">
                                Preencha as informações a seguir para concluir o registro da doação
                            </Text>
                        </View>
                        <View style={styles.stepContainer}>
                            {renderStep(1)}
                            {renderStep(2)}
                            {renderStep(3)}
                        </View>
                        <View style={styles.contentContainer}>{renderContent()}</View>
                    </View>
                )}
            </Surface>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    innerContainer: {
        flex: 1,
        padding: 10,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    inputGroup: {
        marginBottom: 15,
    },
    labelInput: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#f9f9f9',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        zIndex: 2,
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#6200ee',
        color: '#fff',
    },
    surfaceStyle: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        marginTop: 10 * vh,
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
        color: 'black',
        margin: 1,
    },
    scanButton: {
        width: '80%',
        margin: 20,
        borderRadius: 10,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    stepWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleWrapper: {
        // o valor padrão era 1
        zIndex: 0,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeCircle: {
        backgroundColor: 'blue',
    },
    label: {
        color: 'white',
        fontWeight: 'bold',
    },
    activeLabel: {
        color: 'white',
    },
    line: {
        width: 40,
        height: 2,
        backgroundColor: 'black',
        zIndex: 0,
    },
    activeLine: {
        backgroundColor: 'blue',
    },
    contentContainer: {
        flex: 1,
        width: '100%',
    },
    card: {
        fontSize: 16,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
});
