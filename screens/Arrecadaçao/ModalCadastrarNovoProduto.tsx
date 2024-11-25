import React, { useState, useEffect, useContext } from 'react';
import { Button, Divider, Icon, IconButton, Surface, Text, TextInput } from 'react-native-paper';
import { ArrecadacaoType, CategoriaType, ProdutoEncontradoApiType, ProdutoType } from '@/types/types';
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
import { IsNumeric, vh } from '@/utils/utils';
import RegistradoComSucesso from './RegistradoComSucesso';
import { Picker } from '@react-native-picker/picker';
import { createNewCategory, getAllCategories, getAllCategoriesAndMeasures, saveNewArrecadacao, saveNewProduct } from '@/services/RotaryApi';
import { CampanhaContext } from '@/context/Campanha/CampanhaContext';
import { measure } from 'react-native-reanimated';

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

const mapProdutoToProdutoApi = (data: ProdutoType): ProdutoEncontradoApiType => ({
    gtin: data.codigoDeBarras,
    id_produto_categoria: data.categoriaId || "",
    codigo_ncm: data.codigoNCM || "",
    medida_por_embalagem: data.quantidadePorEmbalagem || "",
    produto_medida_sigla: data.siglaMedida || "",
    produto_marca: data.marca || "",
    nome: data.nome || "",
    nome_sem_acento: data.nome.replace('ã', 'a').replace('á', 'a').replace('é', 'e').replace('õ', 'o').replace('ê', 'e').replace('ó', 'o').replace('í', 'i').replace('ú', 'u') || ""
})

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

    const {campanhaAtualId} = useContext(CampanhaContext)

    const [categories, setCategories] = useState<String[]>([])
    const [produto, setProduto] = useState<ProdutoType | null>(
        { codigoDeBarras: code, categoriaId: '', nome: '', marca: '',  quantidadePorEmbalagem: ''}
    );
    
    const [validateInputs, setValidateInputs] = useState({
        gtin: true,
        nome: true,
        //categoria: true,
        marca: true,
        peso: true,
    })
    
    const [novaCategoria, setNovaCategoria] = useState<CategoriaType>({nome_categoria: '', medida_sigla: ''})
    const [isNovaCategoriaValid, setisNovaCategoriaValid] = useState<boolean>(true)

    const [medidaSigla, setMedidaSigla] = useState<string>("")

    const [novaArrecadacao, setNovaArrecadacao] = useState<ArrecadacaoType>({id_campanha: campanhaAtualId, id_produto: produto.codigoDeBarras, qtd_total: 0})

    useEffect(() => {
        const getCategories = async () => {
            await getAllCategories()
            .then(categoriesList => setCategories(categoriesList))
            .catch(error => console.error(error))
        }
    
        getCategories()
      }, [produto.categoriaId]);


      useEffect(() => {
        const getMeasureFromCategory = async () => {
            await getAllCategoriesAndMeasures().then(categoriesList => {
                if (produto.categoriaId.length > 0) {
                    const medida = categoriesList.filter(categoria => categoria.nome_categoria == produto.categoriaId).at(0)?.medida_sigla || ""
                    setMedidaSigla(medida)
                    setProduto({...produto, siglaMedida: medida})
                }
            }
            )
        }

        getMeasureFromCategory()
      }, [produto.categoriaId])
    
      

    // TODO: Implementar a lógica de captura de código de barras
    // produto encontrado: ok
    // produto nao encontrado: ok
    // falha ao ler código de barras: vai ser usado botao de inserir manualmente
    // Falha ao clicar no botao de registrar: voltar para a tela de registrar doacao

    const handleClickRegisterDonation = () => {
        showSuccessRegister();
    };

    const handleClickNewRegister = () => {
        hideModalProductNotFound();
    };

    const [activeStep, setActiveStep] = useState(1);
    
    const validate = (produto: ProdutoType): boolean => {

        setValidateInputs(
            {
                gtin: !!(produto.codigoDeBarras.length > 0 || produto.codigoDeBarras),
                nome: !!(produto.nome.length >= 3 || produto.nome),
                //categoria: !!(produto.categoriaId || produto.categoriaId != ''),
                marca: !!(produto.marca.length >= 2 || produto.marca),
                peso: !!(IsNumeric(produto.quantidadePorEmbalagem) && produto.quantidadePorEmbalagem),
            }

        )
        //se tiver algum falso ja retorna que deu erro
        return !Object.values(validateInputs).includes(false)

    }

    const validateNovaCategoria = (novaCategoria: CategoriaType): boolean => {
        return !!(
        novaCategoria.nome_categoria != '' 
        && novaCategoria.medida_sigla != '' 
        && !IsNumeric(novaCategoria.nome_categoria)
        && !IsNumeric(novaCategoria.medida_sigla))
    }

    const validateSelectedCategoria = (): boolean => {
        return !!(produto.categoriaId || produto.categoriaId != '')
    }

    const handleNewCategory = async () => {
        try{
            await createNewCategory(novaCategoria)
        }
        catch(error){
            console.error(error)
        }
    }

    const handleNewArrecadacao = async () => {
        try{
            await saveNewArrecadacao(novaArrecadacao)
        }
        catch(error){
            console.error(error)
        }
    }

    const handleNewProduct = async () => {
        try{
            await saveNewProduct(mapProdutoToProdutoApi(produto))
        }
        catch(error){
            console.error(error)
        }
    }

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
                <TouchableOpacity 
                onPress={() => setActiveStep(step)} 
                style={styles.circleWrapper}>
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
                return selectOrCreateCategory();
            case 3:
                return registerDonation();
                // return <Text style={styles.card}>This is step 3 content</Text>;
            default:
                return null;
        }
    };

    const createNewProduct = () => {
        return (
            <View style={styles.container}>
                <ScrollView>
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
                            onChangeText={(value) => setProduto({...produto, codigoDeBarras: value})}
                            style={styles.input}
                            placeholder="Código de barras"
                        />
                        {validateInputs.gtin? <></> : <Text style={styles.errorValidation}>O gtin não pode ser vazio</Text>}
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Nome</Text>
                        <TextInput
                            mode="outlined"
                            value={produto.nome}
                            onChangeText={(value) => setProduto({...produto, nome: value})}
                            style={styles.input}
                            placeholder="ex: Arroz Carril Branco"
                        />
                        {validateInputs.nome? <></> : <Text style={styles.errorValidation}>O nome não pode ser vazio ou com poucos caracteres</Text>}
                    </View>
                    {/* TODO: fazer chamada para API e ver categorias disponíveis
					TODO: criar opção de adicionar categoria */}
                    {/* <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Categoria</Text>
                        <TextInput
                            value={produto?.categoriaId}
                            mode="outlined"
                            style={{ marginBottom: 16 }}
                            render={(props) => (
                                <Picker
                                    selectedValue={produto.categoriaId}
                                    onValueChange={(itemValue) => setProduto({ ...produto, categoriaId: itemValue } )}
                                    mode="dropdown"
                                >
                                    <Picker.Item label="Selecione a categoria" value="" />
                                    {categories.map((category) => (
                                        <Picker.Item
                                            key={category}
                                            label={category}
                                            value={category}
                                        />
                                    ))}
                                </Picker>
                            )}
                        />
                    {validateInputs.categoria? <></> : <Text style={styles.errorValidation}>Por favor, escolha uma categoria</Text>}
                    </View> */}

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Marca</Text>
                        <TextInput
                            mode="outlined"
                            value={produto.marca}
                            onChangeText={(value) => setProduto({...produto, marca: value})}
                            style={styles.input}
                            placeholder="Marca"
                        />
                        {validateInputs.marca? <></> : <Text style={styles.errorValidation}>A marca não pode ser vazia</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Peso por embalagem (numero)</Text>
                        <TextInput
                            mode="outlined"
                            value={produto.quantidadePorEmbalagem}
                            onChangeText={(value) => setProduto({...produto, quantidadePorEmbalagem: value})}
                            style={styles.input}
                            placeholder="ex: 1 (kg)"
                        />
                        {validateInputs.peso? <></> : <Text style={styles.errorValidation}>O peso não pode ser vazio e deve conter apenas números</Text>}
                    </View>
                    {/* TODO: adicionar validação antes de poder ir para o proximo */}
                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => {
                            if(validate(produto))
                               handleNextStep()
                            }
                        }
                    >
                        Próximo
                    </Button>
                </View>
                </ScrollView>
            </View>
        );

    };

    const selectOrCreateCategory = () => {
        return (
            <View style={styles.container}>
                <ScrollView style={{...styles.innerContainer, marginBottom: '10px'}}>
                    <View style={styles.inputGroup}>
                        <Text style={{ alignSelf: 'center' }} variant="titleLarge">
                            Selecione a Categoria do seu Produto
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Categoria</Text>
                        <TextInput
                            value={produto?.categoriaId}
                            mode="outlined"
                            style={{ marginBottom: 16 }}
                            render={(props) => (
                                <Picker
                                    selectedValue={produto.categoriaId}
                                    onValueChange={(itemValue) => setProduto({ ...produto, categoriaId: itemValue } )}
                                    mode="dropdown"
                                >
                                    <Picker.Item label="Selecione a categoria" value="" />
                                    {categories.map((category) => (
                                        <Picker.Item
                                            key={category}
                                            label={category}
                                            value={category}
                                        />
                                    ))}
                                </Picker>
                            )}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={{ alignSelf: 'center' }} variant="titleMedium">
                            Ou crie uma nova categoria:
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Nome da Categoria:</Text>
                        <TextInput
                            mode="outlined"
                            value={novaCategoria.nome_categoria}
                            onChangeText={value => setNovaCategoria({...novaCategoria, nome_categoria: value})}
                            style={styles.input}
                            placeholder="ex: Arroz"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.labelInput}>Unidade de medida por embalagem:</Text>
                        <TextInput
                            mode="outlined"
                            value={novaCategoria.medida_sigla}
                            onChangeText={(value) => setNovaCategoria({...novaCategoria, medida_sigla: value})}
                            style={styles.input}
                            placeholder="ex: kg, L"
                        />
                    </View>
        
                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => {
                            if(validateNovaCategoria(novaCategoria)){
                                handleNewCategory()
                                setProduto({...produto, categoriaId: novaCategoria.nome_categoria})
                                setisNovaCategoriaValid(true)
                                handleNextStep()
                            } else {
                                if(validateSelectedCategoria()){
                                    setisNovaCategoriaValid(true)
                                    handleNextStep()
                                }
                            }
                            setisNovaCategoriaValid(false)
                            
                        }}
                    >
                        Próximo
                    </Button>
                    {isNovaCategoriaValid? <></> : <Text style={{...styles.errorValidation, marginBottom: 20}}>Verifique se a categoria está preenchida e sem dados numéricos</Text>}
                </ScrollView>
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
                        <Text style={styles.labelInput}>Quantidade de pacotes (numérico)</Text>
                        <TextInput
                            mode="outlined"
                            value={novaArrecadacao.qtd_total}
                            onChangeText={(value) => {if(IsNumeric(value)) setNovaArrecadacao({...novaArrecadacao, qtd_total: value})}}
                            style={styles.input}
                            placeholder="quantidade de pacotes"
                        />
                    </View>
                    <View style={[styles.header, { marginBottom: 20, alignItems: 'center' }]}>
                        <Text variant="headlineSmall" style={styles.title}>
                            Doação total:
                        </Text>
                        <Text style={styles.title} variant="headlineSmall">
                            {`${novaArrecadacao.qtd_total * produto.quantidadePorEmbalagem} ${medidaSigla}`}
                        </Text>
                    </View>

                    <Button
                        style={styles.button}
                        mode="contained"
                        onPress={() => {
                            handleNewProduct()
                            handleNewArrecadacao()
                            handleClickRegisterDonation()
                        }
                        }
                    >
                        Finalizar
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
    errorValidation: {
        color: 'red'
    },
});
