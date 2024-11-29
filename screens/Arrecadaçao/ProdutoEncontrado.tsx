import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, Icon, Text, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { ArrecadacaoType, ProdutoEncontradoApiType, ProdutoType } from '@/types/types';
import { getAllCategories, saveNewArrecadacao } from '@/services/RotaryApi';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';

export default function ProdutoEncontrado({
    produto,
    setProduto,
    hideModal,
    showSuccessRegister,
}: {
    produto: ProdutoType;
    setProduto: (produto: ProdutoEncontradoApiType) => void;
    hideModal: () => void;
    showSuccessRegister: () => void;
}) {
    const { state } = useContext(ArrecadacaoContext);

    const [selectedCategory, setSelectedCategory] = useState(produto?.categoriaId);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [totalDonation, setTotalDonation] = useState(Number(produto?.quantidadePorEmbalagem));
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingRegisterDonation, setLoadingRegisterDonation] = useState(false);

    console.log('produto encontrado', produto);

    useEffect(() => {
        const getCategories = async () => {
            await getAllCategories()
                .then((categoriesList) => setCategories(categoriesList))
                .catch((error) => console.error(error));
        };

        getCategories();
    }, []);

    const handleQuantityChange = (value: number) => {
        const pesoTotal = Number(produto?.quantidadePorEmbalagem) * value;
        setSelectedQuantity(value);
        setTotalDonation(pesoTotal);
    };

    const handleClickRegisterDonation = async (gtinProduto: string, quantidade: number) => {
        const { idCampanhaEmAndamento } = state;
        if (idCampanhaEmAndamento === null) {
            return;
        }
        if (gtinProduto.trim() === '' || quantidade === 0) {
            console.log('Produto ou quantidade inválidos');
            return;
        }
        const newArrecadacao: ArrecadacaoType = {
            id_campanha: Number(idCampanhaEmAndamento),
            id_produto: gtinProduto,
            qtd_total: quantidade,
        };

        console.log('Enviando arrecadacao: ', newArrecadacao);
        try {
            await saveNewArrecadacao(newArrecadacao);
        } catch (error) {
            console.error('erro ao salvar arrecadacao: ', error);
        }

        showSuccessRegister();
    };

    return (
        <ScrollView style={{ padding: 16 }}>
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
                            <Picker.Item key={category} label={category} value={category} />
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

            {loadingRegisterDonation && (
                <>
                    <ActivityIndicator animating={true} />
                    <Text style={styles.message} variant="titleMedium">
                        Registrando doação
                    </Text>
                </>
            )}

            <Button
                mode="contained"
                onPress={() =>
                    handleClickRegisterDonation(produto.codigoDeBarras, selectedQuantity)
                }
                style={styles.scanButton}
                disabled={loadingRegisterDonation}
            >
                Registrar
            </Button>

            <Button
                mode="outlined"
                onPress={hideModal}
                disabled={loadingRegisterDonation}
                style={[styles.scanButton, { marginTop: 10 }]}
            >
                Voltar
            </Button>
        </ScrollView>
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
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
});
