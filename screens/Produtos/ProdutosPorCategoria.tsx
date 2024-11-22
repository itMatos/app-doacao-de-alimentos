import React, { useState, useEffect } from 'react';
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
} from 'react-native-paper';

// Tipo para os produtos
import { ProdutoEncontradoApiType } from '@/types/types';
import { Picker } from '@react-native-picker/picker';
import DetalhesDoProduto from './DetalhesDoProduto';

// Dados fictícios
const produtosFicticios: ProdutoEncontradoApiType[] = [
    {
        gtin: '7893500020134',
        id_produto_categoria: 'Arroz',
        codigo_ncm: '10063021',
        medida_por_embalagem: '2',
        produto_medida_sigla: 'kg',
        produto_marca: 'Tio João',
        nome_sem_acento: 'Arroz Polido Tipo 1 2kg e aqui ainda pode ter um nome bem aqui né',
    },
    {
        gtin: '7891234567890',
        id_produto_categoria: 'Feijão',
        codigo_ncm: '07133319',
        medida_por_embalagem: '1',
        produto_medida_sigla: 'kg',
        produto_marca: 'Carioca',
        nome_sem_acento: 'Feijão Preto 1kg',
    },
    {
        gtin: '7899876543210',
        id_produto_categoria: 'Arroz',
        codigo_ncm: '10063021',
        medida_por_embalagem: '5',
        produto_medida_sigla: 'kg',
        produto_marca: 'Camil',
        nome_sem_acento: 'Arroz Branco Tipo 1 5kg',
    },
    {
        gtin: '7899876543211',
        id_produto_categoria: 'Arroz',
        codigo_ncm: '10063022',
        medida_por_embalagem: '0.5',
        produto_medida_sigla: 'kg',
        produto_marca: 'Camil',
        nome_sem_acento: 'Bolinho de arroz 500g',
    },
    {
        gtin: '7891122334455',
        id_produto_categoria: 'Feijão',
        codigo_ncm: '07133319',
        medida_por_embalagem: '2',
        produto_medida_sigla: 'kg',
        produto_marca: 'Biju',
        nome_sem_acento: 'Feijão Carioca 2kg',
    },
    {
        gtin: '7891122334477',
        id_produto_categoria: 'Feijão',
        codigo_ncm: '07133325',
        medida_por_embalagem: '2',
        produto_medida_sigla: 'kg',
        produto_marca: 'Biju',
        nome_sem_acento: 'Biju Feijão Preto 2kg',
    },
];

// TODO: Trazer categorias da API
const categorias = ['Arroz', 'Feijão', 'Macarrão'];

const containerStyle = { backgroundColor: 'none', padding: 20, margin: 20 };

export default function ProdutosPorCategoria({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const [selectedCategory, setSelectedCategory] = useState<string>(route.params.category);
    const [sortedProducts, setSortedProducts] = useState<ProdutoEncontradoApiType[]>([]);
    const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);
    const [groupedProductsByInitial, setGroupedProductsByInitial] = useState<
        Record<string, ProdutoEncontradoApiType[]>
    >({});
    const [searchQuery, setSearchQuery] = useState('');
    const [showModalProductDetails, setShowModalProductDetails] = useState(false);
    const [productToShow, setProductToShow] = useState<ProdutoEncontradoApiType | null>(null);

    // Filtra os produtos pela categoria selecionada e ordena
    useEffect(() => {
        const filteredProducts = produtosFicticios.filter(
            (produto) => produto.id_produto_categoria === selectedCategory
        );
        const sorted = filteredProducts.sort((a, b) =>
            a.nome_sem_acento.localeCompare(b.nome_sem_acento)
        );
        setSortedProducts(sorted);
    }, [selectedCategory]);

    // Depois de ordenado, agrupa os produtos por inicial do nome
    useEffect(() => {
        const grouped: Record<string, ProdutoEncontradoApiType[]> = {};
        sortedProducts.forEach((produto) => {
            const initial = produto.nome_sem_acento[0].toUpperCase();
            if (!grouped[initial]) {
                grouped[initial] = [];
            }
            grouped[initial].push(produto);
        });
        setGroupedProductsByInitial(grouped);
    }, [sortedProducts]);

    // para deixar todos os accordions expandidos ao carregar a tela
    useEffect(() => {
        setExpandedAccordions(Object.keys(groupedProductsByInitial));
    }, [groupedProductsByInitial]);

    // expandir ou recolher um accordion
    const handleAccordionPress = (id: string) => {
        setExpandedAccordions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleFilterByCategory = (category: string) => {
        setSelectedCategory(category);
    };

    const showProductDetails = (produto: ProdutoEncontradoApiType) => {
        setProductToShow(produto);
        setShowModalProductDetails(true);
    };

    const filteredGroupedProducts = searchQuery
        ? Object.keys(groupedProductsByInitial).reduce((acc, key) => {
              const filtered = groupedProductsByInitial[key].filter((produto) =>
                  produto.nome_sem_acento.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (filtered.length) {
                  acc[key] = filtered;
              }
              return acc;
          }, {} as Record<string, ProdutoEncontradoApiType[]>)
        : groupedProductsByInitial;

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
                            onValueChange={(itemValue) => handleFilterByCategory(itemValue)}
                            mode="dropdown"
                        >
                            <Picker.Item
                                label={'Selecione uma categoria'}
                                value={selectedCategory}
                            />
                            {categorias.map((categoria) => (
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
                    {Object.keys(filteredGroupedProducts).length === 0 && (
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
