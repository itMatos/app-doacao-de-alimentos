import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, Modal, TouchableOpacity } from 'react-native';
import { Appbar, Button, Portal, Surface, Text } from 'react-native-paper';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { vh } from '@/utils/utils';
import { ProdutoEncontradoType } from '@/types/types';
import ModalRegistroDeDoacao from './ModalRegistroDeDoacao';

const produtoTeste: ProdutoEncontradoType = {
    id: '123123',
    nome: 'Arroz Tio João 2kg',
    categoria: 'Arroz',
    quantidade: 1,
    peso: 2,
    unidadeMedida: 'kg',
};

export default function RegistrarDoacao({ navigation, route }: { navigation: any; route: any }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [visibleModal, setVisibleModal] = useState(false);

    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);

    // TODO: Implementar a lógica de captura de código de barras
    // produto encontrado
    // produto nao encontrado
    // falha ao ler código de barras
    // Falha ao clicar no botao de registrar

    const [produto, setProduto] = useState<ProdutoEncontradoType | null>(null);

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.navigate('ArrecadacaoTelaInicial')} />
                <Appbar.Content title="Registrar doação" />
            </Appbar.Header>
            <View style={styles.container}>
                {!permission && (
                    <View style={styles.container}>
                        <Text style={styles.message} variant="titleMedium">
                            É necessário permissão para acessar a câmera do dispositivo
                        </Text>

                        <Button
                            onPress={requestPermission}
                            mode="contained"
                            style={{ margin: 20, borderRadius: 10, backgroundColor: '#81c784' }}
                        >
                            Conceder permissão
                        </Button>
                    </View>
                )}

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}
                >
                    <Text style={styles.messageCamera} variant="headlineSmall">
                        Aponte a câmera do dispositivo para o código de barras
                    </Text>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            mode="contained"
                            onPress={() => {
                                showModal();
                            }}
                            style={styles.scanButton}
                        >
                            abrir modal
                        </Button>
                    </View>

                    {!visibleModal && (
                        <CameraView style={styles.camera} facing={facing}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => {}}>
                                    <Text style={styles.text}>{''}</Text>
                                </TouchableOpacity>
                            </View>
                        </CameraView>
                    )}

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            mode="contained"
                            style={{
                                margin: 20,
                                borderRadius: 10,
                            }}
                        >
                            Inserir código manualmente
                        </Button>
                    </View>

                    <ModalRegistroDeDoacao visible={visibleModal} hideModal={hideModal} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        margin: 5,
    },
    messageCamera: {
        textAlign: 'center',
        paddingBottom: 10,
        margin: 5,
    },
    camera: {
        flex: 1,
        margin: 5,
        height: 60 * vh,
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    surface: {
        marginHorizontal: 5,
        marginVertical: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        color: 'black',
    },
    title: {
        margin: 5,
    },
    scanButton: {
        width: '80%',
        margin: 'auto',
        borderRadius: 10,
    },
    chip: {
        backgroundColor: '#81c784',
        marginVertical: 4,
    },
});
