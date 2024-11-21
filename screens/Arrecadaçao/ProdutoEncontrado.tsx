import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Icon, Text, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { ProdutoEncontradoApiType, ProdutoType } from '@/types/types';
import { getAllCategories } from '@/services/RotaryApi';

export default function ProdutoEncontrado({
    produto,
    setProduto,
    handleClickRegisterDonation,
    hideModal,
}: {
    produto: ProdutoType | null;
    setProduto: (produto: ProdutoEncontradoApiType) => void;
    handleClickRegisterDonation:(gtinProduto: string, quantidade: number) => Promise<void>;
    hideModal: () => void;
}) {
    const [selectedCategory, setSelectedCategory] = useState(produto?.categoriaId);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [totalDonation, setTotalDonation] = useState(Number(produto?.quantidadePorEmbalagem));

    const [categories, setCategories] = useState<String[]>([])

    useEffect(() => {
        const getCategories = async () => {
            await getAllCategories()
            .then(categoriesList => setCategories(categoriesList))
            .catch(error => console.error(error))
        }
    
        getCategories()
      }, []);

    const handleQuantityChange = (value: number) => {
        const pesoTotal = Number(produto?.quantidadePorEmbalagem) * value;
        setSelectedQuantity(value);
        setTotalDonation(pesoTotal);
    };    

    return (
        <View style={{ padding: 16 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon source="check-circle-outline" size={30} color="#81c784" />
                    <Text variant="titleLarge" style={{ marginHorizontal: 5 }}>
                        Produto encontrado
                    </Text>
                </View>
            </View>

            <View style={{ marginBottom: 20, alignItems: 'center' }}>
                <Text variant="titleMedium">Confirme os dados de doação</Text>
            </View>

            <TextInput
                label="Nome do produto"
                value={produto?.nomeSemAcento}
                mode="outlined"
                editable={false}
                style={{ marginBottom: 16 }}
                multiline={true}
            />

            <TextInput
                label="Peso"
                mode="outlined"
                value={`${produto?.quantidadePorEmbalagem ?? ''}${produto?.siglaMedida ?? ''}`}
                editable={false}
                style={{ marginBottom: 16 }}
            />

            <TextInput
                label="Categoria"
                value={produto?.categoriaId}
                mode="outlined"
                style={{ marginBottom: 16 }}
                render={(props) => (
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
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

            <TextInput
                label="Quantidade"
                value={`${selectedQuantity}`}
                mode="outlined"
                style={{ marginBottom: 16 }}
                render={(props) => (
                    <Picker
                        selectedValue={selectedQuantity}
                        onValueChange={(itemValue) => handleQuantityChange(itemValue)}
                        mode="dropdown"
                    >
                        <Picker.Item label="Selecione a quantidade" value="" />
                        {Array.from({ length: 15 }, (_, i) => (
                            <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
                        ))}
                    </Picker>
                )}
            />

            <Divider style={{ marginVertical: 20 }} />

            <View style={[styles.header, { marginBottom: 20, alignItems: 'center' }]}>
                <Text variant="headlineSmall" style={styles.title}>
                    Doação total
                </Text>
                <Text style={styles.title} variant="headlineSmall">
                    {totalDonation} {produto?.siglaMedida}
                </Text>
            </View>

            <Button
                mode="contained"
                onPress={() => handleClickRegisterDonation(produto?.codigoDeBarras, selectedQuantity )}
                style={styles.scanButton}
            >
                Registrar
            </Button>

            <Button
                mode="outlined"
                onPress={hideModal}
                style={[styles.scanButton, { marginTop: 10 }]}
            >
                Voltar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
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
// function useEffect(arg0: () => void, arg1: never[]) {
//     throw new Error('Function not implemented.');
// }

