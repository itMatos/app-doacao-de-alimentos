import { CategoriaType } from '@/types/types';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Chip,
    Divider,
    Icon,
    IconButton,
    Modal,
    Portal,
    Surface,
    Text,
    TextInput,
} from 'react-native-paper';
import { createNewCategory, getAllCategories } from '@/services/RotaryApi';
import { Picker } from '@react-native-picker/picker';

const mockMedidas = ['kg', 'g', 'ml', 'L'];

export default function ListagemCategorias({ navigation }: { navigation: any }) {
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [modalNewCategoryVisible, setModalNewCategoryVisible] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

    const showModalNewCategory = () => setModalNewCategoryVisible(true);
    const hideModalNewCategory = () => setModalNewCategoryVisible(false);

    const getCategories = async () => {
        try {
            const response = await getAllCategories();
            setAllCategories(response);
        } catch (error) {
            console.error('Error fetching categories', error);
        } finally {
			setIsRefreshing(false);
		}
    };

	const handleReload = () => {
		setIsRefreshing(true);
		getCategories();
	}

    // TODO trazer as medidas da api

    const [formNewCategory, setFormNewCategory] = useState({
        nomeCategoria: '',
        medidaSigla: 'kg',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormNewCategory((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleCreateNewCategory = async () => {
        if (!formNewCategory.nomeCategoria) {
            throw new Error('Categoria não informada');
        }
        try {
            await createNewCategory(formNewCategory as CategoriaType);
            getCategories();
        } catch (error) {
            console.error('Error creating new category', error);
        } finally {
            hideModalNewCategory();
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Surface style={styles.surface} mode="flat" elevation={5}>
                <View style={styles.header}>
                    <Text variant="titleMedium" style={styles.title}>
                        Produtos por categoria
                    </Text>
                    <Text style={{ alignSelf: 'center' }}>
                        <IconButton
                            icon="reload"
                            size={20}
                            onPress={() => handleReload()}
                        />
                    </Text>
                </View>

                <Divider />

                <View style={styles.innerContainer}>
                    <Divider />
                    {(allCategories.length === 0 || isRefreshing) &&  (
                        <ActivityIndicator animating={true} style={{ marginVertical: 10 }} />
                    )}
                    {allCategories.map((categoria, index) => (
                        <React.Fragment key={`fragment-${categoria}`}>
                            <View style={styles.rowContainer} key={`view-${categoria}`}>
                                <Text style={styles.leftText} key={`text-${categoria}`}>
                                    {categoria}
                                </Text>
                                <View style={styles.rightContainer}>
                                    <Button
                                        key={`button-${categoria}`}
                                        icon={() => <Icon source="arrow-right" size={16} />}
                                        mode="text"
                                        onPress={() => {
                                            navigation.navigate('ProdutosPorCategoria', {
                                                category: categoria,
                                            });
                                        }}
                                        style={styles.buttonDetails}
                                        contentStyle={{
                                            flexDirection: 'row-reverse',
                                        }}
                                    >
                                        Ver produtos cadastrados
                                    </Button>
                                </View>
                            </View>
                            <View
                                style={{ flex: 1, width: '100%' }}
                                key={`category-divider-${index}`}
                            >
                                <Divider />
                            </View>
                        </React.Fragment>
                    ))}
                    <Button
                        icon={() => <Icon source="plus" size={16} color="white" />}
                        mode="contained"
                        style={{ borderRadius: 10, marginVertical: 10 }}
                        onPress={() => showModalNewCategory()}
                    >
                        Criar nova categoria
                    </Button>
                </View>
            </Surface>

            <Portal>
                <Modal
                    visible={modalNewCategoryVisible}
                    onDismiss={() => hideModalNewCategory()}
                    contentContainerStyle={{
                        borderRadius: 10,
                        overflow: 'hidden',
                        padding: 0,
                        marginHorizontal: 10,
                        backgroundColor: 'white',
                    }}
                >
                    {modalNewCategoryVisible && (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Surface elevation={2} style={{ borderRadius: 20 }}>
                                <View style={{ flex: 1, margin: 20 }}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.labelInput}>Nome da categoria</Text>
                                        <TextInput
                                            mode="outlined"
                                            value={formNewCategory.nomeCategoria}
                                            onChangeText={(text) =>
                                                handleInputChange('nomeCategoria', text)
                                            }
                                            multiline
                                            style={{
                                                paddingVertical: 5,
                                                alignContent: 'center',
                                                justifyContent: 'center',
                                            }}
                                            dense
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.labelInput}>Unidade de medida</Text>
                                        <TextInput
                                            value={formNewCategory.medidaSigla}
                                            mode="outlined"
                                            dense
                                            render={(props) => (
                                                <Picker
                                                    selectedValue={formNewCategory.medidaSigla}
                                                    onValueChange={(itemValue) =>
                                                        handleInputChange('medidaSigla', itemValue)
                                                    }
                                                    mode="dropdown"
                                                >
                                                    <Picker.Item
                                                        label={'Selecione uma unidade de medida'}
                                                        value={formNewCategory.medidaSigla}
                                                    />
                                                    {mockMedidas.map((medida) => (
                                                        <Picker.Item
                                                            key={medida}
                                                            label={medida}
                                                            value={medida}
                                                        />
                                                    ))}
                                                </Picker>
                                            )}
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Button
                                            mode="contained"
                                            onPress={() => {
                                                handleCreateNewCategory();
                                            }}
                                            style={styles.button}
                                        >
                                            Salvar
                                        </Button>

                                        <Button
                                            mode="outlined"
                                            onPress={() => {
                                                hideModalNewCategory();
                                            }}
                                            style={styles.button}
                                        >
                                            Fechar
                                        </Button>
                                    </View>
                                </View>
                            </Surface>
                        </ScrollView>
                    )}
                </Modal>
            </Portal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
    },
    title: {
        margin: 5,
    },
    surface: {
        marginHorizontal: 5,
        marginVertical: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    innerContainer: {
        alignItems: 'center',

        width: '100%',
    },
    categoryContainer: {
        width: '100%',
        elevation: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        color: 'black',
    },
    leftText: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        height: 80,
    },
    rightContainer: {
        flex: 1,
        margin: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    buttonDetails: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    inputGroup: {
        marginBottom: 10,
    },
    labelInput: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        marginVertical: 5,
        alignSelf: 'center',
    },
});
