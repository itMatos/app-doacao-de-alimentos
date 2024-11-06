import { vh } from '@/utils/utils';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Divider, Icon, Portal, Surface, Text, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { Provider as PaperProvider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

export default function ProdutoEncontrado() {
    const produtoTeste = {
        nome: 'Arroz Tio João',
        categoria: 'Arroz',
        quantidade: '1',
        peso: 2,
        unidadeMedida: 'kg',
    };
    const OPTIONS = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [selectedCategory, setSelectedCategory] = useState();

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

                <TextInput label="Nome do produto" value={produtoTeste.nome} mode="outlined" />

                <TextInput
                    label="Peso"
                    mode="outlined"
                    value={produtoTeste.peso + produtoTeste.unidadeMedida}
                />

                {/* TODO: Ajustar a label de componentes que tem atributo render*/}

                <TextInput
                    label="Categoria"
                    value={produtoTeste.peso + produtoTeste.unidadeMedida}
                    mode="outlined"
                    render={(props) => (
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
                            mode="dropdown"
                        >
                            <Picker.Item
                                label={produtoTeste.categoria}
                                value={produtoTeste.categoria}
                            />
                            <Picker.Item label="Feijão" value="Feijão" />
                        </Picker>
                    )}
                />

                <TextInput
                    label="Qtd"
                    value={produtoTeste.peso + produtoTeste.unidadeMedida}
                    mode="outlined"
                    render={(props) => (
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
                            mode="dropdown"
                        >
                            <Picker.Item
                                label={produtoTeste.quantidade}
                                value={produtoTeste.quantidade}
                            />
                            <Picker.Item label="Feijão" value="Feijão" />
                        </Picker>
                    )}
                />
            </View>

            <Divider />

            <View style={styles.header}>
                <Text variant="titleMedium" style={styles.title}>
                    Campanha 1
                </Text>
                <Text style={styles.title} variant="titleMedium">
                    2kg
                </Text>
            </View>
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
