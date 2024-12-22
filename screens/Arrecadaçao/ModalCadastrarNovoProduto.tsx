import React, { useState, useEffect, useContext } from 'react';
import { Button, Divider, Icon, IconButton, Surface, Text, TextInput } from 'react-native-paper';
import {
    ArrecadacaoType,
    CategoriaType,
    ProdutoEncontradoApiType,
    ProdutoType,
} from '@/types/types';
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import ProdutoEncontrado from './ProdutoEncontrado';
import { vh, isValidNumber } from '@/utils/utils';
import RegistradoComSucesso from './RegistradoComSucesso';
import { Picker } from '@react-native-picker/picker';
import {
    createNewCategory,
    getAllCategories,
    getAllCategoriesAndMeasures,
    saveNewArrecadacao,
    saveNewProduct,
} from '@/services/RotaryApi';
import { CampanhaContext } from '@/context/Campanha/CampanhaContext';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';

const mapProdutoToProdutoApi = (data: ProdutoType): ProdutoEncontradoApiType => ({
    gtin: data.codigoDeBarras,
    id_produto_categoria: data.categoriaId || '',
    codigo_ncm: data.codigoNCM || '',
    medida_por_embalagem: data.quantidadePorEmbalagem || '',
    produto_medida_sigla: data.siglaMedida || '',
    produto_marca: data.marca || '',
    nome: data.nome || '',
    nome_sem_acento:
        data.nome
            .replace('ã', 'a')
            .replace('á', 'a')
            .replace('é', 'e')
            .replace('õ', 'o')
            .replace('ê', 'e')
            .replace('ó', 'o')
            .replace('í', 'i')
            .replace('ú', 'u') || '',
});

export default function ModalCadastrarNovoProduto({
    visible,
    hideModalProductNotFound,
    isLoading,
    onDismiss,
    code,
}: {
    visible: boolean;
    hideModalProductNotFound: () => void;
    isLoading: boolean;
    onDismiss: () => void;
    code: string;
}) {
    const { state } = useContext(ArrecadacaoContext);
    const idCampanhaEmAndamento = state.idCampanhaEmAndamento ?? '';

    const [successRegister, setSuccessRegister] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [categories, setCategories] = useState<CategoriaType[]>([]);
    const defaultState = {
        codigoDeBarras: code,
        categoriaId: '',
        codigoNCM: '',
        quantidadePorEmbalagem: '',
        siglaMedida: '',
        marca: 'NÃO INFORMADO',
        nome: '',
        nomeSemAcento: '',
    };
    const [produto, setProduto] = useState(defaultState);
    const [validateInputs, setValidateInputs] = useState({
        gtin: true,
        nome: true,
        //categoria: true,
        marca: true,
        peso: true,
    });
    const [novaCategoria, setNovaCategoria] = useState({
        nome_categoria: '',
        medida_sigla: '',
    });
    const [isNovaCategoriaValid, setisNovaCategoriaValid] = useState<boolean>(true);
    const [medidaSigla, setMedidaSigla] = useState<string>('');
    const [novaArrecadacao, setNovaArrecadacao] = useState<ArrecadacaoType>({
        id_campanha: Number(idCampanhaEmAndamento),
        id_produto: produto.codigoDeBarras,
        qtd_total: 1,
    });
    const [showCreateNewCategory, setShowCreateNewCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [pacotesInput, setPacotesInput] = useState('1');

    const showSuccessRegister = () => setSuccessRegister(true);
    const hideSuccessRegister = () => setSuccessRegister(false);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        try {
            const categoriesList = await getAllCategoriesAndMeasures();
            setCategories(categoriesList);
        } catch (error) {
            console.error(error);
        }
    };

    const registerDonationFromNewProduct = () => {
        handleNewProduct();
    };

    const handleNewProduct = async () => {
        try {
            const create = await saveNewProduct(mapProdutoToProdutoApi(produto));
            console.log('create', create);
            handleNewArrecadacao();
        } catch (error) {
            console.error(error);
        }
    };

    const handleNewArrecadacao = async () => {
        try {
            await saveNewArrecadacao(novaArrecadacao);
            showSuccessRegister();
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickNewRegister = () => {
        hideModalProductNotFound();
    };

    const step1InputIsValid = () => {
        const validateInputsFromStep1 = {
            gtin: !!(produto.codigoDeBarras.length > 0 || produto.codigoDeBarras),
            nome: !!(produto.nome.length >= 3 || produto.nome),
            //categoria: !!(produto.categoriaId || produto.categoriaId != ''),
            marca: !!(produto.marca.length >= 2 || produto.marca),
            peso: !!(
                isValidNumber(produto.quantidadePorEmbalagem) && produto.quantidadePorEmbalagem
            ),
        };
        setValidateInputs(validateInputsFromStep1);
        const isStep1Valid = !Object.values(validateInputsFromStep1).includes(false);
        return isStep1Valid;
    };

    const validateNovaCategoria = (novaCategoria: CategoriaType): boolean => {
        return !!(
            novaCategoria.nome_categoria != '' &&
            novaCategoria.medida_sigla != '' &&
            !isValidNumber(novaCategoria.nome_categoria) &&
            !isValidNumber(novaCategoria.medida_sigla)
        );
    };

    const validateSelectedCategoria = (): boolean => {
        return !!(produto.categoriaId || produto.categoriaId != '');
    };

    const handleCreateNewCategory = async () => {
        try {
            await createNewCategory(novaCategoria);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNextStep = () => {
        if (activeStep < 3) setActiveStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        if (activeStep > 1) setActiveStep((prev) => prev - 1);
    };

    const handleSaveProduct = () => {
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
                return selectOrCreateCategory();
            case 2:
                return createNewProduct();
            case 3:
                return registerDonation();
            default:
                return null;
        }
    };

    const handleClickNextStep = () => {
        const validateInputs = step1InputIsValid();
        if (validateInputs) handleNextStep();
    };

    const handleChangeSelectCategory = (itemValue: string) => {
        setSelectedCategory(itemValue);
        console.log('itemValue', itemValue);
        if (itemValue == 'newCategory') {
            setShowCreateNewCategory(true);
        } else {
            console.log('categoria selecionada ja esta cadastrada');
            setShowCreateNewCategory(false);
            const categoria = categories
                .filter((categoria) => categoria.nome_categoria == itemValue)
                .at(0);

            if (categoria?.medida_sigla && categoria?.nome_categoria) {
                setProduto({
                    ...produto,
                    categoriaId: categoria.nome_categoria,
                    siglaMedida: categoria.medida_sigla,
                });
                setMedidaSigla(categoria.medida_sigla);
            }
        }
    };

    const handleValidateNewCategory = () => {
        if (validateNovaCategoria(novaCategoria)) {
            handleCreateNewCategory();
            setProduto({
                ...produto,
                categoriaId: novaCategoria.nome_categoria,
                siglaMedida: novaCategoria.medida_sigla,
            });
            setisNovaCategoriaValid(true);
            handleNextStep();
            return;
        } else {
            if (validateSelectedCategoria()) {
                setisNovaCategoriaValid(true);
                handleNextStep();
                return;
            }
        }
        setisNovaCategoriaValid(false);
    };

    const handleValidateCategoryBeforeNextStep = () => {
        if (showCreateNewCategory) {
            handleValidateNewCategory();
        } else {
            if (validateSelectedCategoria()) {
                handleNextStep();
            }
        }
    };

    useEffect(() => {
        if (code) {
            setProduto({ ...produto, codigoDeBarras: code });
            setNovaArrecadacao({ ...novaArrecadacao, id_produto: code });
        }
    }, [code]);

    const handleChangeBarCode = (value: string) => {
        if (value.trim().length > 0) {
            setProduto({ ...produto, codigoDeBarras: value });
        }
    };

    const createNewProduct = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={{ alignSelf: 'center' }} variant="titleLarge">
                            Cadastre o produto
                        </Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Código de barras</Text>

                        <TextInput
                            keyboardType="numeric"
                            mode="outlined"
                            value={produto.codigoDeBarras}
                            onChangeText={(value) => handleChangeBarCode(value)}
                            style={styles.input}
                            placeholder="Código de barras"
                        />
                        {!!validateInputs.gtin ? (
                            <></>
                        ) : (
                            <Text style={styles.errorValidation}>Informe o código de barras</Text>
                        )}
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Nome</Text>
                        <TextInput
                            mode="outlined"
                            value={produto.nome}
                            onChangeText={(value) => setProduto({ ...produto, nome: value })}
                            style={styles.input}
                            placeholder="ex: Arroz Carril Branco"
                        />
                        {validateInputs.nome ? (
                            <></>
                        ) : (
                            <Text style={styles.errorValidation}>Descreva o nome do produto</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Marca</Text>
                        <TextInput
                            mode="outlined"
                            value={produto.marca}
                            onChangeText={(value) => setProduto({ ...produto, marca: value })}
                            style={styles.input}
                            placeholder="Marca"
                        />
                        {validateInputs.marca ? (
                            <></>
                        ) : (
                            <Text style={styles.errorValidation}>Informe o nome da marca</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Peso por embalagem</Text>
                        <TextInput
                            mode="outlined"
                            value={produto.quantidadePorEmbalagem}
                            right={
                                <TextInput.Icon icon={() => <Text>{produto.siglaMedida}</Text>} />
                            }
                            onChangeText={(value) =>
                                setProduto({ ...produto, quantidadePorEmbalagem: value })
                            }
                            style={styles.input}
                            placeholder="ex: 1 (kg)"
                        />
                        {validateInputs.peso ? (
                            <></>
                        ) : (
                            <Text style={styles.errorValidation}>
                                O peso não pode ser vazio e deve conter apenas números
                            </Text>
                        )}
                    </View>
                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => handleClickNextStep()}
                    >
                        Próximo
                    </Button>

                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => hideModalProductNotFound()}
                    >
                        Fechar
                    </Button>
                </View>
            </ScrollView>
        );
    };

    const selectOrCreateCategory = () => {
        return (
            <View style={styles.container}>
                <ScrollView
                    style={{ ...styles.innerContainer, marginBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.inputGroup}>
                        <Text style={{ alignSelf: 'center' }} variant="titleLarge">
                            Informe a Categoria do Produto
                        </Text>
                        <Text
                            style={{ alignSelf: 'center', marginTop: 5, marginBottom: 10 }}
                            variant="titleMedium"
                        >
                            Essa informação é utilizada para agrupar os tipos de produtos.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Categoria</Text>
                        <TextInput
                            value={selectedCategory}
                            mode="outlined"
                            dense
                            style={{ marginBottom: 16 }}
                            render={(props) => (
                                <>
                                    <Picker
                                        selectedValue={selectedCategory}
                                        onValueChange={(itemValue) =>
                                            handleChangeSelectCategory(itemValue)
                                        }
                                        mode="dropdown"
                                    >
                                        <Picker.Item label="Selecione a categoria" value="" />
                                        {categories.map((category, index) => (
                                            <Picker.Item
                                                key={`${category.nome_categoria}-${index}`}
                                                label={category.nome_categoria}
                                                value={category.nome_categoria}
                                            />
                                        ))}

                                        <Picker.Item
                                            label="--------------------------------"
                                            value="divider"
                                            enabled={false}
                                        />

                                        <Picker.Item
                                            label="Criar nova categoria"
                                            value="newCategory"
                                        />
                                    </Picker>
                                </>
                            )}
                        />
                    </View>

                    {showCreateNewCategory && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={{ alignSelf: 'flex-start' }} variant="titleMedium">
                                    Preencha as informações abaixo
                                </Text>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Nome da Categoria:</Text>
                                <TextInput
                                    mode="outlined"
                                    value={novaCategoria.nome_categoria}
                                    onChangeText={(value) =>
                                        setNovaCategoria({
                                            ...novaCategoria,
                                            nome_categoria: value,
                                        })
                                    }
                                    style={styles.input}
                                    placeholder="ex: Arroz"
                                />
                                {!isNovaCategoriaValid &&
                                    novaCategoria.medida_sigla.trim() === '' && (
                                        <Text style={styles.errorValidation}>
                                            Insira o nome da categoria corretamente
                                        </Text>
                                    )}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>
                                    Unidade de medida da categoria:
                                </Text>
                                <TextInput
                                    mode="outlined"
                                    value={novaCategoria.medida_sigla}
                                    onChangeText={(value) =>
                                        setNovaCategoria({ ...novaCategoria, medida_sigla: value })
                                    }
                                    style={styles.input}
                                    placeholder="ex: kg, L"
                                />
                                {!isNovaCategoriaValid &&
                                    novaCategoria.medida_sigla.trim() === '' && (
                                        <Text style={styles.errorValidation}>
                                            Insira uma unidade de medida válida
                                        </Text>
                                    )}
                            </View>
                        </>
                    )}

                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => handleValidateCategoryBeforeNextStep()}
                    >
                        Próximo
                    </Button>
                    {isNovaCategoriaValid ? (
                        <></>
                    ) : (
                        <Text style={{ ...styles.errorValidation, marginBottom: 20 }}>
                            Verifique se a categoria está preenchida e sem dados numéricos
                        </Text>
                    )}
                </ScrollView>
            </View>
        );
    };

    const handleChangePacotes = (value: string) => {
        setPacotesInput(value);
        if (isValidNumber(value) && value.length > 0) {
            const parsedTextToInt = parseInt(value, 10);
            console.log('parsedTextToInt', parsedTextToInt);
            setNovaArrecadacao({ ...novaArrecadacao, qtd_total: parsedTextToInt });
        } else {
            setNovaArrecadacao({ ...novaArrecadacao, qtd_total: 1 });
        }
    };

    const totalDonation =
        Number(novaArrecadacao.qtd_total) * Number(produto.quantidadePorEmbalagem);

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
                        <Text style={styles.labelInput}>Quantidade de pacotes</Text>
                        <TextInput
                            mode="outlined"
                            value={pacotesInput}
                            onChangeText={(text) => {
                                handleChangePacotes(text);
                            }}
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="quantidade de pacotes"
                        />
                    </View>
                    <View style={[styles.header, { marginBottom: 20, alignItems: 'center' }]}>
                        <Text variant="headlineSmall" style={styles.title}>
                            Doação total:
                        </Text>
                        <Text style={styles.title} variant="headlineSmall">
                            {`${totalDonation} ${produto.siglaMedida}`}
                        </Text>
                    </View>

                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => {
                            registerDonationFromNewProduct();
                        }}
                    >
                        Finalizar
                    </Button>

                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => {
                            hideModalProductNotFound();
                        }}
                    >
                        Fechar
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
            onDismiss={onDismiss}
        >
            <Surface style={styles.surfaceStyle}>
                {isLoading && <Text>Carregando...</Text>}
                {!isLoading && !successRegister && (
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            margin: 10,
                        }}
                    >
                        <View style={{ alignItems: 'center', margin: 20 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginVertical: 10,
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
                {successRegister && !isLoading && (
                    <RegistradoComSucesso handleClickNewRegister={handleClickNewRegister} />
                )}
            </Surface>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        justifyContent: 'center',
        padding: 4,
    },
    innerContainer: {
        flex: 1,
        padding: 10,
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

        color: '#fff',
    },
    surfaceStyle: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: '#ffffff',
        marginHorizontal: 5,
        marginTop: 8 * vh,
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
        marginTop: 10,
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
    },
    card: {
        fontSize: 16,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    errorValidation: {
        color: 'red',
    },
});
