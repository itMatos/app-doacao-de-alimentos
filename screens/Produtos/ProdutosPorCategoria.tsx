import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, StatusBar } from 'react-native';
import { Appbar, List, Text, Button, Divider, TextInput } from 'react-native-paper';

// Tipo para os produtos
import { ProdutoEncontradoApiType } from '@/types/types';
import { Picker } from '@react-native-picker/picker';

// Dados fictícios
const produtosFicticios: ProdutoEncontradoApiType[] = [
    {
        gtin: '7893500020134',
        id_produto_categoria: 'Arroz',
        codigo_ncm: '10063021',
        medida_por_embalagem: '2',
        produto_medida_sigla: 'kg',
        produto_marca: 'Tio João',
        nome_sem_acento: 'Arroz Polido Tipo 1 2kg',
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
        gtin: '7891122334455',
        id_produto_categoria: 'Feijão',
        codigo_ncm: '07133319',
        medida_por_embalagem: '2',
        produto_medida_sigla: 'kg',
        produto_marca: 'Biju',
        nome_sem_acento: 'Feijão Carioca 2kg',
    },
];

const categorias = ['Arroz', 'Feijão', 'Macarrão'];

export default function ProdutosPorCategoria({ navigation }: { navigation: any }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('Arroz');
    const [sortedProducts, setSortedProducts] = useState<ProdutoEncontradoApiType[]>([]);
    const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);

    useEffect(() => {
        const filteredProducts = produtosFicticios.filter(
            (produto) => produto.id_produto_categoria === selectedCategory
        );
        const sorted = filteredProducts.sort((a, b) =>
            a.nome_sem_acento.localeCompare(b.nome_sem_acento)
        );
        setSortedProducts(sorted);
    }, [selectedCategory]);

    const [groupedProducts, setGroupedProducts] = useState<
        Record<string, ProdutoEncontradoApiType[]>
    >({});

    const handleAccordionPress = (id: string) => {
        setExpandedAccordions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Agrupa os produtos por inicial e organiza alfabeticamente
    useEffect(() => {
        const grouped: Record<string, ProdutoEncontradoApiType[]> = {};
        produtosFicticios
            .sort((a, b) => a.nome_sem_acento.localeCompare(b.nome_sem_acento))
            .forEach((produto) => {
                const initial = produto.nome_sem_acento[0].toUpperCase();
                if (!grouped[initial]) {
                    grouped[initial] = [];
                }
                grouped[initial].push(produto);
            });
        setGroupedProducts(grouped);
    }, []);

    const handleFilterByCategory = (category: string) => {
        setSelectedCategory(category);
        const filtered = produtosFicticios.filter(
            (produto) => produto.id_produto_categoria === category
        );
        setSortedProducts(filtered);
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />

            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Produtos por Categoria" />
            </Appbar.Header>

            <View style={styles.pickerContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.labelInput}>Categoria</Text>
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
                                    <Picker.Item
                                        key={categoria}
                                        label={categoria}
                                        value={categoria}
                                    />
                                ))}
                            </Picker>
                        )}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <List.AccordionGroup>
                        <View>
                            {Object.keys(groupedProducts).map((initial) => (
                                <List.Accordion
                                    title={initial}
                                    id={initial}
                                    key={initial}
                                    style={styles.accordion}
                                >
                                    {groupedProducts[initial].map((produto) => (
                                        <View key={produto.gtin}>
                                            <List.Item
                                                title={produto.nome_sem_acento}
                                                description={`Embalagem de ${produto.medida_por_embalagem} ${produto.produto_medida_sigla}`}
                                                right={() => (
                                                    <Text>{produto.produto_medida_sigla}</Text>
                                                )}
                                            />
                                            <Divider />
                                        </View>
                                    ))}
                                    <Divider />
                                </List.Accordion>
                            ))}
                        </View>
                    </List.AccordionGroup>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pickerContainer: {
        padding: 16,
    },
    pickerLabel: {
        marginBottom: 8,
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    accordion: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
    },
    inputGroup: {
        marginBottom: 10,
    },
    labelInput: {
        fontSize: 16,
        marginBottom: 5,
    },
});
