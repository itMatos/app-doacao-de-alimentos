import {
    createNewCategory,
    getAllCategoriesAndMeasures,
    saveNewProduct,
} from '@/services/RotaryApi';
import { CategoriaType } from '@/types/types';
import { Picker } from '@react-native-picker/picker';
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, StatusBar, TouchableOpacity, Modal } from 'react-native';
import {
    Button,
    Portal,
    Text,
    TextInput,
    Appbar,
    Snackbar,
    ActivityIndicator,
} from 'react-native-paper';

export default function CadastrarNovoProduto({ navigation }: { navigation: any }) {
    const [permission, requestPermission] = useCameraPermissions();
    const facing = useState<CameraType>('back');
    const [allCategories, setAllCategories] = useState<CategoriaType[]>([]);
    const [formData, setFormData] = useState({
        nome_sem_acento: '',
        gtin: '',
        id_produto_categoria: 'Arroz',
        produto_medida_sigla: 'kg',
        medida_por_embalagem: '1',
        produto_marca: 'NÃO INFORMADO',
        codigo_ncm: 'NÃO INFORMADO',
    });
    const [selectedCategory, setSelectedCategory] = useState<CategoriaType>({
        nome_categoria: '',
        medida_sigla: '',
    });
    const [showCreateNewCategory, setShowCreateNewCategory] = useState(false);
    const [newCategoryInfo, setNewCategoryInfo] = useState({
        nome_categoria: '',
        medida_sigla: '',
    });
    const [inputError, setInputError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);

    const [barCode, setBarCode] = useState('');
    const [cameraVisible, setCameraVisible] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    const openCamera = () => {
        if (!permission?.granted) {
            requestPermission();
        } else {
            setCameraVisible(true);
        }
    };

    const handleBarcodeScanned = (barcode: BarcodeScanningResult) => {
        setBarCode(barcode.data);
        handleInputChange('gtin', barcode.data);
        setCameraVisible(false);
    };

    const getCategories = async () => {
        try {
            const response = await getAllCategoriesAndMeasures();
            console.log('response', response);
            setAllCategories(response);
            const setDefault = response[0];
            setFormData((prev) => ({
                ...prev,
                id_produto_categoria: setDefault.nome_categoria,
                produto_medida_sigla: setDefault.medida_sigla,
            }));
        } catch (error) {
            console.error('Erro ao buscar categorias e medidas', error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setInputError(false);
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateNewCategoryName = (newCategoryName: string) => {
        setNewCategoryInfo((prev) => ({
            ...prev,
            nome_categoria: newCategoryName,
        }));
    };

    const handleCreateNewCategorySigla = (newCategorySigla: string) => {
        if (newCategorySigla.trim() === '') setInputError(true);
        setNewCategoryInfo((prev) => ({
            ...prev,
            medida_sigla: newCategorySigla,
        }));
    };

    const handleSelectCategoryDropdown = (selectedCategoryValue: string) => {
        setInputError(false);
        setSelectedCategory((prev) => ({
            ...prev,
            nome_categoria: selectedCategoryValue,
        }));
        if (selectedCategoryValue === 'newCategory') {
            setShowCreateNewCategory(true);
        } else {
            setShowCreateNewCategory(false);
            const category = allCategories.find(
                (cat) => cat.nome_categoria === selectedCategoryValue
            );
            if (category) {
                setFormData((prev) => ({
                    ...prev,
                    id_produto_categoria: category.nome_categoria,
                    produto_medida_sigla: category.medida_sigla,
                }));
            }
        }
    };

    const handleClickSave = async () => {
        setIsCreatingNewProduct(true);
        const validateInputs = handleValidateInputs();
        if (!validateInputs) {
            setInputError(true);
            const message = 'Verifique se todos os campos estão preenchidos corretamente';
            setErrorMessage(message);
            setIsCreatingNewProduct(false);
            return;
        } else {
            setInputError(false);
        }

        if (showCreateNewCategory) {
            const newCategory = {
                nome_categoria: newCategoryInfo.nome_categoria,
                medida_sigla: newCategoryInfo.medida_sigla,
            };
            try {
                await createNewCategory(newCategory);
            } catch (error) {
                const message = 'Erro ao criar nova categoria';
                setErrorMessage(message);
                setIsCreatingNewProduct(false);
                return;
            }
        }
        // TODO: adicionar modal para confirmar os dados do produto (codigo de barras, nome e peso da embalagem)
        // TODO: modal deve permitir corrigir informações antes de salvar

        createProduct();
    };

    const createProduct = async () => {
        const newProduct = {
            nome_sem_acento: formData.nome_sem_acento,
            nome: formData.nome_sem_acento,
            gtin: formData.gtin,
            id_produto_categoria: showCreateNewCategory
                ? newCategoryInfo.nome_categoria
                : formData.id_produto_categoria,
            produto_medida_sigla: showCreateNewCategory
                ? newCategoryInfo.medida_sigla
                : formData.produto_medida_sigla,
            medida_por_embalagem: formData.medida_por_embalagem,
            produto_marca: formData.produto_marca,
            codigo_ncm: formData.codigo_ncm,
        };
        try {
            await saveNewProduct(newProduct);
        } catch (error) {
            const message = 'Erro ao salvar o produto';
            setErrorMessage(message);
            return;
        } finally {
            setIsCreatingNewProduct(false);
        }
    };

    const handleValidateInputs = () => {
        if (showCreateNewCategory) {
            if (newCategoryInfo.nome_categoria.trim() === '') return false;
            if (newCategoryInfo.medida_sigla.trim() === '') return false;
        } else {
            if (selectedCategory.nome_categoria.trim() === '') return false;
        }

        if (formData.gtin.trim() === '') return false;
        if (formData.nome_sem_acento.trim() === '') return false;
        if (formData.medida_por_embalagem.trim() === '') return false;
        if (formData.produto_marca.trim() === '') return false;
        return true;
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />

            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Novo produto" />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.content}>
                    {/* <Button onPress={() => {}}>
                                    {inputError ? 'Hide' : 'Show'}
                                </Button> */}
                    {inputError && (
                        <View style={{ marginTop: 60 }}>
                            <Snackbar visible={inputError} onDismiss={() => {}}>
                                {errorMessage}
                            </Snackbar>
                        </View>
                    )}

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Código de barras</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    mode="outlined"
                                    error={formData.gtin.trim() === '' && inputError}
                                    value={formData.gtin}
                                    onChangeText={(text) => handleInputChange('gtin', text)}
                                    dense
                                    right={<TextInput.Icon icon="camera" onPress={openCamera} />}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Nome do produto</Text>
                                <TextInput
                                    error={formData.nome_sem_acento.trim() === '' && inputError}
                                    mode="outlined"
                                    value={formData.nome_sem_acento}
                                    onChangeText={(text) =>
                                        handleInputChange('nome_sem_acento', text)
                                    }
                                    multiline
                                    style={{ paddingVertical: 5 }}
                                    dense
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Categoria</Text>
                                <TextInput
                                    error={
                                        selectedCategory.nome_categoria.trim() === '' && inputError
                                    }
                                    value={selectedCategory.nome_categoria}
                                    mode="outlined"
                                    dense
                                    render={(props) => (
                                        <Picker
                                            selectedValue={selectedCategory.nome_categoria}
                                            onValueChange={(itemValue) =>
                                                handleSelectCategoryDropdown(itemValue)
                                            }
                                            mode="dropdown"
                                        >
                                            <Picker.Item label="Selecione a categoria" value="" />
                                            {allCategories.map((category, index) => (
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
                                    )}
                                />
                                {selectedCategory.nome_categoria !== 'newCategory' &&
                                    selectedCategory.nome_categoria.trim() !== '' && (
                                        <View
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                        >
                                            <Text variant="labelLarge">
                                                Unidade de medida desta categoria:{' '}
                                            </Text>
                                            <Text variant="labelLarge" style={{ color: 'blue' }}>
                                                {formData.produto_medida_sigla}
                                            </Text>
                                        </View>
                                    )}
                            </View>

                            {showCreateNewCategory && (
                                <>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.labelInput}>
                                            Nome da nova categoria
                                        </Text>
                                        <TextInput
                                            error={
                                                newCategoryInfo.nome_categoria.trim() === '' &&
                                                inputError
                                            }
                                            mode="outlined"
                                            value={newCategoryInfo.nome_categoria}
                                            onChangeText={(text) =>
                                                handleCreateNewCategoryName(text)
                                            }
                                            dense
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.labelInput}>
                                            Unidade de medida da categoria
                                        </Text>
                                        <TextInput
                                            error={
                                                newCategoryInfo.medida_sigla.trim() === '' &&
                                                inputError
                                            }
                                            value={newCategoryInfo.medida_sigla}
                                            mode="outlined"
                                            dense
                                            onChangeText={(text) =>
                                                handleCreateNewCategorySigla(text)
                                            }
                                        />
                                    </View>
                                </>
                            )}

                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Medida por embalagem</Text>
                                <TextInput
                                    error={
                                        formData.medida_por_embalagem.trim() === '' && inputError
                                    }
                                    mode="outlined"
                                    value={formData.medida_por_embalagem}
                                    onChangeText={(text) =>
                                        handleInputChange('medida_por_embalagem', text)
                                    }
                                    right={<TextInput.Affix text={formData.produto_medida_sigla} />}
                                    keyboardType="numeric"
                                    dense
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Marca</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.produto_marca}
                                    onChangeText={(text) =>
                                        handleInputChange('produto_marca', text)
                                    }
                                    dense
                                />
                            </View>

                            {isCreatingNewProduct ? (
                                <ActivityIndicator animating={true} />
                            ) : (
                                <Button
                                    mode="contained"
                                    onPress={handleClickSave}
                                    style={styles.button}
                                >
                                    Salvar Alterações
                                </Button>
                            )}
                        </View>

                        <Portal>
                            <Modal
                                visible={cameraVisible}
                                onRequestClose={() => setCameraVisible(false)}
                            >
                                <CameraView
                                    style={styles.camera}
                                    facing={'back'}
                                    barcodeScannerSettings={{
                                        barcodeTypes: ['ean13', 'ean8'],
                                    }}
                                    onBarcodeScanned={handleBarcodeScanned}
                                >
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity style={styles.button} onPress={() => {}}>
                                            <Text style={styles.text}>{''}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </CameraView>
                            </Modal>
                        </Portal>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    noPermission: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
    },
    card: {
        elevation: 0,
        borderRadius: 8,
        marginBottom: 16,
    },
    label: {
        fontWeight: '400',
    },
    footer: {
        marginTop: 'auto',
    },
    inputGroup: {
        marginBottom: 10,
    },
    labelInput: {
        fontSize: 16,
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    camera: {
        flex: 1,
    },
    text: {
        color: '#fff',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 20,
        width: '100%',
        paddingHorizontal: 20,
    },
    unit: {
        fontSize: 16,
        color: '#666',
    },
});
