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
import { getAllCategories, getAllProductsByCategory } from '@/services/RotaryApi';

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

export default function ProdutosPorCategoria({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const [selectedCategory, setSelectedCategory] = useState<string>(route.params.category);
    const [productsByCategory, setProductsByCategory] = useState<ProdutoEncontradoApiType[]>([]);
    const [sortedProducts, setSortedProducts] = useState<ProdutoEncontradoApiType[]>([]);
    const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);
    const [groupedProductsByInitial, setGroupedProductsByInitial] = useState<
        Record<string, ProdutoEncontradoApiType[]>
    >({});
    const [searchQuery, setSearchQuery] = useState('');
    const [showModalProductDetails, setShowModalProductDetails] = useState(false);
    const [productToShow, setProductToShow] = useState<ProdutoEncontradoApiType | null>(null);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const showProductDetails = (produto: ProdutoEncontradoApiType) => {
        setProductToShow(produto);
        setShowModalProductDetails(true);
    };

    const getCategories = async () => {
        try {
            setIsLoading(true);
            const response = await getAllCategories();
            setAllCategories(response);
        } catch (error) {
            console.error('Error fetching categories', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getProductsByCategory = async (category: string) => {
        try {
            setIsLoading(true);
            const response = await getAllProductsByCategory(category);
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
        if (selectedCategory) {
            getProductsByCategory(selectedCategory);
        }
    }, [selectedCategory]);

    // Usar useMemo para otimizar a filtragem, ordenação e agrupamento
    const filteredAndGroupedProducts = useMemo(() => {
        const filteredProducts = productsByCategory.filter(
            (produto) => produto.id_produto_categoria === selectedCategory
        );
        const sorted = filteredProducts.sort((a, b) =>
            a.nome_sem_acento.localeCompare(b.nome_sem_acento)
        );
        const grouped = sorted.reduce(
            (acc: Record<string, ProdutoEncontradoApiType[]>, produto) => {
                const initial = produto.nome_sem_acento[0].toUpperCase();
                if (!acc[initial]) {
                    acc[initial] = [];
                }
                acc[initial].push(produto);
                return acc;
            },
            {}
        );
        return grouped;
    }, [productsByCategory, selectedCategory]);

    useEffect(() => {
        setGroupedProductsByInitial(filteredAndGroupedProducts);
    }, [filteredAndGroupedProducts]);

    // Para deixar todos os accordions expandidos ao carregar a tela
    useEffect(() => {
        setExpandedAccordions(Object.keys(groupedProductsByInitial));
    }, [groupedProductsByInitial]);

    const handleAccordionPress = (id: string) => {
        setExpandedAccordions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const filteredGroupedProducts = useMemo(() => {
        if (!debouncedSearchQuery) return groupedProductsByInitial;

        return Object.keys(groupedProductsByInitial).reduce(
            (acc: Record<string, ProdutoEncontradoApiType[]>, key) => {
                const filtered = groupedProductsByInitial[key].filter((produto) =>
                    produto.nome_sem_acento
                        .toLowerCase()
                        .includes(debouncedSearchQuery.toLowerCase())
                );
                if (filtered.length) {
                    acc[key] = filtered;
                }
                return acc;
            },
            {}
        );
    }, [debouncedSearchQuery, groupedProductsByInitial]);

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
                            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
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
                    {Object.keys(filteredGroupedProducts).length === 0 && !isLoading && (
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
                    ))}
                </View>

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
                        {showModalProductDetails && productToShow !== null && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Surface elevation={2} style={{ borderRadius: 20 }}>
                                    <DetalhesDoProduto
                                        visible={showModalProductDetails}
                                        isLoading={false}
                                        hideModal={() => setShowModalProductDetails(false)}
                                        produto={productToShow}
                                        goBackToProductsList={() =>
                                            setShowModalProductDetails(false)
                                        }
                                        showCloseDetailsButton={true}
                                    />
                                </Surface>
                            </ScrollView>
                        )}
                    </Modal>
                </Portal>
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
