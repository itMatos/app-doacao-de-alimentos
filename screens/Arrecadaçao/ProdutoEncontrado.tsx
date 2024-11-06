import { vh } from '@/utils/utils';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Divider, Icon, Portal, Surface, Text, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { Provider as PaperProvider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { ProdutoEncontradoType } from '@/types/types';

const produtoTeste: ProdutoEncontradoType = {
    id: '123123',
    nome: 'Arroz Tio João 2kg',
    categoria: 'Arroz',
    quantidade: 1,
    peso: 2,
    unidadeMedida: 'kg',
};

const categories = [
    { label: 'Feijão', value: 'Feijão' },
    { label: 'Arroz', value: 'Arroz' },
    { label: 'Macarrão', value: 'Macarrão' },
    { label: 'Açúcar', value: 'Açúcar' },
    { label: 'Óleo', value: 'Óleo' },
    { label: 'Leite', value: 'Leite' },
    { label: 'Farinha', value: 'Farinha' },
    { label: 'Sal', value: 'Sal' },
    { label: 'Café', value: 'Café' },
    { label: 'Biscoito', value: 'Biscoito' },
    { label: 'Enlatados', value: 'Enlatados' },
    { label: 'Bebidas', value: 'Bebidas' },
    { label: 'Higiene pessoal', value: 'Higiene pessoal' },
    { label: 'Limpeza', value: 'Limpeza' },
    { label: 'Outros', value: 'Outros' },
];

export default function ProdutoEncontrado({
    produto,
    setProduto,
    handleClickRegisterDonation,
    hideModal,
}: {
    produto: ProdutoEncontradoType;
    setProduto: (produto: ProdutoEncontradoType) => void;
    handleClickRegisterDonation: () => void;
    hideModal: () => void;
}) {
    const [selectedCategory, setSelectedCategory] = useState(produto.categoria);
    const [selectedQuantity, setSelectedQuantity] = useState(produto.quantidade);
    const [total, setTotal] = useState(produto.peso * produto.quantidade);

    const handleQuantityChange = (value: number) => {
        setSelectedQuantity(value);
        setTotal(produto.peso * value);
    };

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <View style={styles.container}>
                <Text variant="titleMedium" style={{ marginVertical: 10 }}>
                    <Icon source="check-circle-outline" size={24} color="#81c784" />
                    Produto encontrado
                </Text>

                <Text variant="titleMedium" style={{ marginVertical: 10 }}>
                    Confirme os dados de doação
                </Text>

                <TextInput
                    label="Nome do produto"
                    value={produtoTeste.nome}
                    mode="outlined"
                    editable={false}
                />

                <TextInput
                    label="Peso"
                    mode="outlined"
                    value={produtoTeste.peso + produtoTeste.unidadeMedida}
                    editable={false}
                />

                {/* TODO: Ajustar a label de componentes que tem atributo render*/}

                <TextInput
                    label="Categoria"
                    value={produtoTeste.categoria}
                    mode="outlined"
                    render={(props) => (
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
                            mode="dropdown"
                        >
                            {/* TODO: se a categoria não tiver sido selecionada, exibir "Selecione a categoria" */}
                            <Picker.Item label="Selecione a categoria" value={selectedQuantity} />
                            {categories.map((category) => (
                                <Picker.Item
                                    key={category.label}
                                    label={category.label}
                                    value={category.value}
                                />
                            ))}
                        </Picker>
                    )}
                />

                <TextInput
                    label="Quantidade"
                    value={`${produtoTeste.quantidade}`}
                    mode="outlined"
                    render={(props) => (
                        <Picker
                            selectedValue={selectedQuantity}
                            onValueChange={(itemValue) => handleQuantityChange(itemValue)}
                            mode="dropdown"
                        >
                            <Picker.Item label="Selecione a quantidade" value={selectedQuantity} />
                            {Array.from({ length: 15 }, (_, i) => (
                                <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
                            ))}
                        </Picker>
                    )}
                />
            </View>

            <Divider />

            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>
                    Doação total
                </Text>
                <Text style={styles.title} variant="headlineSmall">
                    {total} {produtoTeste.unidadeMedida}
                </Text>
            </View>

            <Button
                mode="contained"
                onPress={() => handleClickRegisterDonation()}
                style={styles.scanButton}
            >
                Registrar doação
            </Button>

            <Button mode="outlined" onPress={() => hideModal()} style={styles.scanButton}>
                Voltar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
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
        margin: 5,
    },
    scanButton: {
        width: '80%',
        margin: 20,
        borderRadius: 10,
    },
});
