import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, StyleSheet, StatusBar, FlatList } from 'react-native';
import {
    Appbar,
    List,
    Text,
    Button,
    Divider,
    TextInput,
    Modal,
    IconButton,
    Badge,
    Searchbar,
    Portal,
    Surface,
    ActivityIndicator,
    DataTable,
    Snackbar,
} from 'react-native-paper';
import { ProdutoEncontradoApiType } from '@/types/types';
import { Picker } from '@react-native-picker/picker';
import DetalhesDoProduto from './DetalhesDoProduto';
import {
    getAllCategories,
    getAllProductsByCategory,
    getProductByCategoryPaginated,
} from '@/services/RotaryApi';

export default function ProdutosPorCategoria({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const [selectedCategory, setSelectedCategory] = useState<string>(route.params.category);
    const [productsByCategory, setProductsByCategory] = useState<ProdutoEncontradoApiType[]>([]);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeletedMessage, setShowDeletedMessage] = useState(false);

    const [showModalProductDetails, setShowModalProductDetails] = useState(false);
    const [productToShow, setProductToShow] = useState<ProdutoEncontradoApiType | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([50, 100]);
    const [itemsPerPage, setItemsPerPage] = useState<number>(numberOfItemsPerPageList[0]);

    const showProductDetails = (produto: ProdutoEncontradoApiType) => {
        setProductToShow(produto);
        setShowModalProductDetails(true);
    };

    const getCategories = async () => {
        try {
            const response = await getAllCategories();
            setAllCategories(response);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const loadProducts = async (category: string) => {
        try {
            setIsLoading(true);
            const response = await getProductByCategoryPaginated(category, 1, 10000);
            setProductsByCategory(response);
        } catch (error) {
            console.error('Error fetching products by category', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory.trim() !== '') {
            setPage(0);
            loadProducts(selectedCategory);
        }
    }, [selectedCategory]);

    const handleChangeFilterByCategory = (category: string) => {
        if (category !== 'Selecione uma categoria') {
            setSelectedCategory(category);
        }
    };

    const removeProductFromList = (gtin: string) => {
        const updatedProducts = productsByCategory.filter((produto) => produto.gtin !== gtin);
        setProductsByCategory(updatedProducts);
        handleShowDeletedMessage();
    };

    const handleShowDeletedMessage = () => {
        setShowDeletedMessage(true);
        setTimeout(() => {
            handleHideDeletedMessage();
        }, 3000);
    };
    const handleHideDeletedMessage = () => {
        setShowDeletedMessage(false);
    };

    // Filtra os produtos pelo searchQuery
    const filteredProducts = productsByCategory.filter((produto) =>
        produto.nome_sem_acento.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Cálculo de paginação local
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, filteredProducts.length);
    const numberOfPages = Math.ceil(filteredProducts.length / itemsPerPage);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Produtos por Categoria" />
            </Appbar.Header>

            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Filtrar por categoria</Text>
                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue) => handleChangeFilterByCategory(itemValue)}
                    mode="dropdown"
                >
                    <Picker.Item label={'Selecione uma categoria'} value={selectedCategory} />
                    {allCategories.map((categoria) => (
                        <Picker.Item key={categoria} label={categoria} value={categoria} />
                    ))}
                </Picker>
            </View>

            {isLoading && (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <ActivityIndicator animating={true} />
                </View>
            )}

            {!isLoading && filteredProducts.length === 0 && (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={styles.labelInput}>Nenhum produto encontrado</Text>
                </View>
            )}

            <ScrollView>
                {/* <Searchbar
                    placeholder="Buscar produto"
                    onChangeText={(query) => setSearchQuery(query)}
                    value={searchQuery}
                    style={styles.searchInput}
                    mode="bar"
                    clearIcon={
                        searchQuery.length > 0
                            ? () => <IconButton icon="close" onPress={() => setSearchQuery('')} />
                            : undefined
                    }
                    elevation={1}
                /> */}
                <Portal>
                    <Snackbar
                        visible={showDeletedMessage}
                        onDismiss={() => setShowDeletedMessage(false)}
                        duration={3000}
                    >
                        Produto excluído com sucesso!
                    </Snackbar>
                </Portal>

                {!isLoading && productsByCategory.length > 0 && (
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Produto</DataTable.Title>
                            <DataTable.Title numeric>Embalagem</DataTable.Title>
                            <DataTable.Title numeric>Ação</DataTable.Title>
                        </DataTable.Header>

                        {productsByCategory.slice(from, to).map((item) => (
                            <DataTable.Row key={item.gtin}>
                                <DataTable.Cell style={{ flex: 2 }}>
                                    <Text style={{ flexShrink: 1, flexWrap: 'wrap' }}>
                                        {item.nome_sem_acento}
                                    </Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={{ flex: 1 }}>
                                    {item.medida_por_embalagem} {item.produto_medida_sigla}
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={{ flex: 1 }}>
                                    <IconButton
                                        icon="information"
                                        onPress={() => showProductDetails(item)}
                                    />
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}

                        <DataTable.Pagination
                            page={page}
                            numberOfPages={numberOfPages}
                            onPageChange={(newPage) => setPage(newPage)}
                            label={`${from + 1}-${to} de ${filteredProducts.length}`}
                            numberOfItemsPerPageList={numberOfItemsPerPageList}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={(newItemsPerPage) =>
                                setItemsPerPage(newItemsPerPage)
                            }
                            showFastPaginationControls
                            selectPageDropdownLabel={'Linhas por página'}
                        />
                    </DataTable>
                )}
            </ScrollView>

            {showModalProductDetails && productToShow !== null && (
                <Portal>
                    <Modal
                        visible={showModalProductDetails}
                        onDismiss={() => setShowModalProductDetails(false)}
                        contentContainerStyle={{
                            borderRadius: 10,
                            overflow: 'hidden',
                            padding: 0,
                            marginHorizontal: 10,
                            backgroundColor: 'white',
                        }}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <DetalhesDoProduto
                                visible={showModalProductDetails}
                                isLoading={false}
                                hideModal={() => setShowModalProductDetails(false)}
                                produto={productToShow}
                                goBackToProductsList={() => setShowModalProductDetails(false)}
                                showCloseDetailsButton={true}
                                removeProductFromList={removeProductFromList}
                            />
                        </ScrollView>
                    </Modal>
                </Portal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    pickerContainer: {
        padding: 10,
    },
    pickerLabel: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    accordion: {
        backgroundColor: '#FFF',
    },
    inputGroup: {
        marginBottom: 10,
    },
    labelInput: {
        fontSize: 16,
        marginBottom: 5,
    },
    searchInput: {
        marginBottom: 10,
        marginLeft: 150,
        marginRight: 10,
    },
    containerStyle: {
        backgroundColor: 'none',
        margin: 10,
        borderRadius: 10,
    },
});
