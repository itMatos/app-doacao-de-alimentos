import { ProdutoEncontradoApiType } from '@/types/types';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, StatusBar } from 'react-native';
import {
    Card,
    Button,
    Divider,
    Title,
    Paragraph,
    Portal,
    Modal,
    Text,
    TextInput,
    Appbar,
} from 'react-native-paper';

const categories = ['Arroz', 'Feijão', 'Óleo', 'Leite', 'Açúcar', 'Farinha', 'Macarrão', 'Fubá'];
const medidas = ['kg', 'L', 'un'];

export default function CadastrarNovoProduto({ navigation }: { navigation: any }) {
    const [modalConfirmationDelete, setModalConfirmationDelete] = useState(false);
    const [editInformation, setEditInformation] = useState(false);

    const showModalDelete = () => setModalConfirmationDelete(true);
    const hideModalDelete = () => setModalConfirmationDelete(false);

    const showEditInformation = () => setEditInformation(true);
    const hideEditInformation = () => setEditInformation(false);

    const [formData, setFormData] = useState({
        nome_sem_acento: '',
        gtin: '',
        id_produto_categoria: 'Arroz',
        produto_medida_sigla: 'kg',
        medida_por_embalagem: '1',
        produto_marca: 'NÃO INFORMADO',
        codigo_ncm: 'NÃO INFORMADO',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // TODO - adicionar lógica para salvar as alterações
        // TODO adicionar loading enquanto salva
        hideEditInformation();
        // onSave(formData);

        // linha seguinte salva localmente sem precisar fazer um novo get
        produto = Object.assign(produto, formData);
    };

    const containerStyle = { backgroundColor: 'none', padding: 20, margin: 20 };
    // if (!visible) return null;0

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />

            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Nova campanha" />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.content}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Produto</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.nome_sem_acento}
                                    onChangeText={(text) =>
                                        handleInputChange('nome_sem_acento', text)
                                    }
                                    multiline
                                    style={{ paddingVertical: 5 }}
                                    dense
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Código de barras</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.gtin}
                                    onChangeText={(text) => handleInputChange('gtin', text)}
                                    dense
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Categoria</Text>
                                <TextInput
                                    value={formData.id_produto_categoria ?? 'Arroz'}
                                    mode="outlined"
                                    dense
                                    render={(props) => (
                                        <Picker
                                            selectedValue={formData.id_produto_categoria}
                                            onValueChange={(itemValue) =>
                                                handleInputChange('id_produto_categoria', itemValue)
                                            }
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
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Unidade de medida</Text>
                                <TextInput
                                    value={formData.produto_medida_sigla}
                                    mode="outlined"
                                    dense
                                    render={(props) => (
                                        <Picker
                                            selectedValue={formData.produto_medida_sigla}
                                            onValueChange={(itemValue) =>
                                                handleInputChange('produto_medida_sigla', itemValue)
                                            }
                                            mode="dropdown"
                                        >
                                            <Picker.Item
                                                label={formData.produto_medida_sigla ?? 'kg'}
                                                value={formData.produto_medida_sigla ?? 'kg'}
                                            />
                                            {medidas.map((medida) => (
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
                                <Text style={styles.labelInput}>Medida por embalagem</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.medida_por_embalagem}
                                    onChangeText={(text) =>
                                        handleInputChange('medida_por_embalagem', text)
                                    }
                                    right={<TextInput.Affix text={formData.produto_medida_sigla} />}
                                    keyboardType="numeric"
                                    dense
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Marca</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.produto_marca}
                                    onChangeText={(text) =>
                                        handleInputChange('produto_marca', text)
                                    }
                                    dense
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.labelInput}>Código NCM</Text>
                                <TextInput
                                    mode="outlined"
                                    value={formData.codigo_ncm}
                                    onChangeText={(text) => handleInputChange('codigo_ncm', text)}
                                    dense
                                />
                            </View>

                            <Button mode="contained" onPress={handleSave} style={styles.button}>
                                Salvar Alterações
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
    },
    card: {
        elevation: 0,
        borderRadius: 8,
        marginBottom: 16,
    },
    label: {
        fontWeight: '400',
    },
    footer: {
        marginTop: 'auto',
    },
    inputGroup: {
        marginBottom: 10,
    },
    labelInput: {
        fontSize: 16,
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    unit: {
        fontSize: 16,
        color: '#666',
    },
});
