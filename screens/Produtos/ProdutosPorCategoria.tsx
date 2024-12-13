import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, StyleSheet, StatusBar } from 'react-native';
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

    const [searchQuery, setSearchQuery] = useState('');
    const [showModalProductDetails, setShowModalProductDetails] = useState(false);
    const [productToShow, setProductToShow] = useState<ProdutoEncontradoApiType | null>(null);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const showProductDetails = (produto: ProdutoEncontradoApiType) => {
        setProductToShow(produto);
        setShowModalProductDetails(true);
    };

    const getCategories = async () => {
        try {
            // setIsLoading(true);
            const response = await getAllCategories();
            setAllCategories(response);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
        //  finally {
        //     setIsLoading(false);
        // }
    };

    const getProductsByCategory = async (category: string, page: number, limit: number) => {
        try {
            setIsLoading(true);
            const response = await getProductByCategoryPaginated(category, page, limit);
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
            getProductsByCategory(selectedCategory, page, itemsPerPage);
        }
    }, [selectedCategory]);

    const handleChangeFilterByCategory = (category: string) => {
        if (category !== 'Selecione uma categoria') {
            setSelectedCategory(category);
            // getProductsByCategory(category);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />

            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Produtos por Categoria" />
            </Appbar.Header>

            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Filtrar por categoria</Text>
                <TextInput
                    mode="outlined"
                    dense
                    render={(props) => (
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue) => handleChangeFilterByCategory(itemValue)}
                            mode="dropdown"
                        >
                            <Picker.Item
                                label={'Selecione uma categoria'}
                                value={selectedCategory}
                            />
                            {allCategories.map((categoria) => (
                                <Picker.Item key={categoria} label={categoria} value={categoria} />
                            ))}
                        </Picker>
                    )}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    <Searchbar
                        placeholder="Buscar produto"
                        onChangeText={(query) => setSearchQuery(query)}
                        value={searchQuery}
                        style={styles.searchInput}
                        mode="bar"
                        clearIcon={() =>
                            searchQuery.length > 0 && (
                                <IconButton icon="close" onPress={() => setSearchQuery('')} />
                            )
                        }
                        elevation={1}
                    />
                }

                <View style={{ marginHorizontal: 2 }}>
                    {isLoading && (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <ActivityIndicator animating={true} />
                        </View>
                    )}
                    {productsByCategory.length === 0 && !isLoading && (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Text style={styles.labelInput}>Nenhum produto encontrado</Text>
                        </View>
                    )}

                    {productsByCategory.map((produto) => (
                        <View key={produto.gtin}>
                            <List.Item
                                title={produto.nome_sem_acento}
                                description={`Embalagem de ${produto.medida_por_embalagem} ${produto.produto_medida_sigla}`}
                                right={(props) => (
                                    <Button icon="plus" onPress={() => showProductDetails(produto)}>
                                        Detalhes
                                    </Button>
                                )}
                            />
                            <Divider />
                        </View>
                    ))}

                    {/* {Object.keys(filteredGroupedProducts)?.length === 0 && !isLoading && (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Text style={styles.labelInput}>Nenhum produto encontrado</Text>
                        </View>
                    )}

                    {Object.keys(filteredGroupedProducts).map((initial) => (
                        <List.Accordion
                            title={initial}
                            id={initial}
                            key={initial}
                            style={styles.accordion}
                            expanded={expandedAccordions.includes(initial)}
                            onPress={() => handleAccordionPress(initial)}
                        >
                            {filteredGroupedProducts[initial]?.map((produto) => (
                                <View key={produto.gtin}>
                                    <List.Item
                                        title={produto.nome_sem_acento}
                                        description={`Embalagem de ${produto.medida_por_embalagem} ${produto.produto_medida_sigla}`}
                                        right={(props) => (
                                            <Button
                                                icon="plus"
                                                onPress={() => showProductDetails(produto)}
                                            >
                                                Detalhes
                                            </Button>
                                        )}
                                    />
                                    <Divider />
                                </View>
                            ))}
                            <Divider />
                        </List.Accordion>
                    ))} */}
                </View>

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
                                />
                            </ScrollView>
                        </Modal>
                    </Portal>
                )}
            </ScrollView>
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
