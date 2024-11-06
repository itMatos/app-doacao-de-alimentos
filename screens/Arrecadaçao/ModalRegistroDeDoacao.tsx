import React, { useState } from 'react';
import { Surface } from 'react-native-paper';
import { ProdutoEncontradoType } from '@/types/types';
import { Modal, StyleSheet } from 'react-native';
import ProdutoEncontrado from './ProdutoEncontrado';
import { vh } from '@/utils/utils';
import RegistradoComSucesso from './RegistradoComSucesso';

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
            <Surface mode="flat" style={styles.surfaceStyle}>
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
    surfaceStyle: {
        flex: 1,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        marginTop: 20 * vh,
        justifyContent: 'center',
    },
});
