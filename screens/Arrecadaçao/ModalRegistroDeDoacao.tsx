import React, { useState } from 'react';
import { Button, Portal, Surface } from 'react-native-paper';
import { CameraType, useCameraPermissions } from 'expo-camera';
import { ProdutoEncontradoType } from '@/types/types';
import { Modal, StyleSheet } from 'react-native';
import ProdutoEncontrado from './ProdutoEncontrado';
import { vh } from '@/utils/utils';
import RegistradoComSucesso from './RegistradoComSucesso';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const produtoTeste: ProdutoEncontradoType = {
    id: '123123',
    nome: 'Arroz Tio João 2kg',
    categoria: 'Arroz',
    quantidade: 1,
    peso: 2,
    unidadeMedida: 'kg',
};

export default function ModalRegistroDeDoacao({
    visible,
    hideModal,
}: {
    visible: boolean;
    hideModal: () => void;
}) {
    const [successRegister, setSuccessRegister] = useState(false);

    const showSuccessRegister = () => setSuccessRegister(true);
    const hideSuccessRegister = () => setSuccessRegister(false);

    // TODO: Implementar a lógica de captura de código de barras
    // produto encontrado: ok
    // produto nao encontrado: ok
    // falha ao ler código de barras: vai ser usado botao de inserir manualmente
    // Falha ao clicar no botao de registrar: voltar para a tela de registrar doacao

    const [produto, setProduto] = useState<ProdutoEncontradoType | null>(null);

    const handleClickRegisterDonation = () => {
        showSuccessRegister();
    };

    const handleClickNewRegister = () => {
        hideSuccessRegister();
        hideModal();
    };

    return (
        <Modal visible={visible} onDismiss={hideModal} animationType="slide" transparent={true}>
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
                {!successRegister && (
                    <ProdutoEncontrado
                        produto={produtoTeste}
                        setProduto={setProduto}
                        handleClickRegisterDonation={handleClickRegisterDonation}
                        hideModal={handleClickNewRegister}
                    />
                )}
                {successRegister && (
                    <RegistradoComSucesso handleClickNewRegister={handleClickNewRegister} />
                )}
            </Surface>
        </Modal>
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
