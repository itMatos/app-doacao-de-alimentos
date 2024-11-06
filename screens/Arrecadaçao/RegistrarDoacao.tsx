import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, Modal } from 'react-native';
import { Appbar, Button, Portal, Surface, Text } from 'react-native-paper';
import { CameraType, useCameraPermissions } from 'expo-camera';
import { vh } from '@/utils/utils';
import ProdutoEncontrado from './ProdutoEncontrado';
import RegistradoComSucesso from './RegistradoComSucesso';

export default function RegistrarDoacao({ navigation, route }: { navigation: any; route: any }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [visible, setVisible] = useState(false);
    const [successReading, setSuccessReading] = useState(false);
    const [successRegister, setSuccessRegister] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const showProductFound = () => setSuccessReading(true);
    const hideProductFound = () => setSuccessReading(false);

    const showSuccessRegister = () => setSuccessRegister(true);
    const hideSuccessRegister = () => setSuccessRegister(false);

    // TODO: Implementar a lógica de captura de código de barras
    // produto encontrado
    // produto nao encontrado
    // falha ao ler código de barras
    // Falha ao clicar no botao de registrar

    const handleClickRegister = () => {
        hideProductFound();
        showSuccessRegister();
    };

    const handleClickNewRegister = () => {
        hideSuccessRegister();
        hideModal();
    };

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
                        justifyContent: 'space-evenly',
                    }}
                >
                    <Text style={styles.messageCamera} variant="headlineSmall">
                        Aponte a câmera do dispositivo para o código de barras
                    </Text>
                    <View
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            mode="contained"
                            onPress={() => {
                                showModal();
                                showProductFound();
                            }}
                            style={styles.scanButton}
                        >
                            abrir modal{' '}
                        </Button>
                    </View>
                    {/* <CameraView style={styles.camera} facing={facing}>
                        <View style={styles.buttonContainer}>
                            {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}> */}
                    {/* <Text style={styles.text}>Flip Camera</Text> */}
                    {/* </TouchableOpacity> */}
                    {/* </View> */}
                    {/* </CameraView> */}

                    <Portal>
                        <Modal
                            visible={visible}
                            onDismiss={hideModal}
                            animationType="slide"
                            transparent={true}
                        >
                            <Surface
                                style={{
                                    flex: 1,
                                    padding: 20,
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 0,
                                    backgroundColor: '#ffffff',
                                    elevation: 4,
                                    marginHorizontal: 10,
                                    marginTop: 20 * vh,
                                    height: 50 * vh,
                                    justifyContent: 'center',
                                }}
                            >
                                {successReading && <ProdutoEncontrado />}

                                {successReading && (
                                    <Button
                                        mode="contained"
                                        onPress={() => handleClickRegister()}
                                        style={styles.scanButton}
                                    >
                                        Registrar
                                    </Button>
                                )}

                                {successRegister && <RegistradoComSucesso />}

                                {successRegister && (
                                    <Button
                                        mode="contained"
                                        onPress={() => handleClickNewRegister()}
                                        style={styles.scanButton}
                                    >
                                        Registrar nova doação
                                    </Button>
                                )}

                                <Button
                                    mode="outlined"
                                    onPress={() => handleClickNewRegister()}
                                    style={styles.scanButton}
                                >
                                    Voltar
                                </Button>
                            </Surface>
                        </Modal>
                    </Portal>
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
        margin: 10,
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
    scrollContent: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    iconButton: {
        height: 150,
        width: 150,
        borderRadius: 100,
    },
    scanButton: {
        width: '80%',
        margin: 20,
        borderRadius: 10,
    },
    buttonCloseCampaign: {
        width: '80%',
        margin: 20,
        borderRadius: 10,
        backgroundColor: '#d32f2f',
    },
    categoryContainer: {
        width: '100%',
        elevation: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    innerContainerCategory: {
        alignItems: 'center',
        borderRadius: 100,
    },
    chip: {
        backgroundColor: '#81c784',
        marginVertical: 4,
    },
});
