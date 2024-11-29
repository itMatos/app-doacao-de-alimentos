import React, { useState, useContext } from 'react';
import { Surface, Text } from 'react-native-paper';
import { ArrecadacaoType, ProdutoEncontradoApiType, ProdutoType } from '@/types/types';
import { Modal, StyleSheet } from 'react-native';
import ProdutoEncontrado from './ProdutoEncontrado';
import { vh } from '@/utils/utils';
import RegistradoComSucesso from './RegistradoComSucesso';
import { useContextKey } from 'expo-router/build/Route';
import { CampanhaContext } from '@/context/Campanha/CampanhaContext';
import { saveNewArrecadacao } from '@/services/RotaryApi';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';

// objeto para teste sem precisar utilizar api
// const produtoTesteApiResult: ProdutoEncontradoApiType = {
//     gtin: '7893500020134',
//     id_produto_categoria: 'Arroz',
//     codigo_ncm: '10063021',
//     medida_por_embalagem: '2',
//     produto_medida_sigla: '',
//     produto_marca: 'NÃO INFORMADO',
//     nome: 'Arroz Polido Tipo 1 Tio JoÃ£o 100 GrÃ£os Nobres Pacote 2kg',
//     nome_sem_acento: 'Arroz Polido Tipo 1 Tio Joao 100 Graos Nobres Pacote 2kg',
// };

const mapProdutoEncontrado = (data: ProdutoEncontradoApiType): ProdutoType => ({
    codigoDeBarras: data.gtin,
    categoriaId: data.id_produto_categoria ?? 'Arroz',
    codigoNCM: data.codigo_ncm,
    quantidadePorEmbalagem: data.medida_por_embalagem ?? '1',
    siglaMedida: data.produto_medida_sigla ?? 'kg',
    marca: data.produto_marca ?? 'MARCA NÃO INFORMADA',
    nome: data.nome,
    nomeSemAcento: data.nome_sem_acento,
});

export default function ModalRegistroDeDoacao({
    visible,
    hideModal,
    isLoading,
    produto,
}: {
    visible: boolean;
    hideModal: () => void;
    isLoading: boolean;
    produto: ProdutoEncontradoApiType;
}) {
    const [successRegister, setSuccessRegister] = useState(false);
    const showSuccessRegister = () => setSuccessRegister(true);
    const hideSuccessRegister = () => setSuccessRegister(false);
    const produtoFiltered = mapProdutoEncontrado(produto);

    // TODO: Implementar a lógica de captura de código de barras
    // produto encontrado: ok
    // produto nao encontrado: ok
    // falha ao ler código de barras: vai ser usado botao de inserir manualmente
    // Falha ao clicar no botao de registrar: voltar para a tela de registrar doacao

    const handleClickNewRegister = () => {
        hideSuccessRegister();
        hideModal();
    };

    return (
        <Modal visible={visible} onDismiss={hideModal} animationType="slide" transparent={true}>
            <Surface mode="flat" style={styles.surfaceStyle}>
                {isLoading && <Text>Carregando...</Text>}
                {!successRegister && !isLoading && (
                    <ProdutoEncontrado
                        produto={produtoFiltered}
                        setProduto={() => {}}
                        hideModal={handleClickNewRegister}
                        showSuccessRegister={showSuccessRegister}
                    />
                )}
                {successRegister && !isLoading && (
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
