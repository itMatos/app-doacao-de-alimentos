import { ProdutoEncontradoApiType } from '@/types/types';
import { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Icon, Surface, Text } from 'react-native-paper';

export default function ModalDetalhesDoProduto({
    visible,
    isLoading,
    hideDetalhesProduto,
    produto,
}: {
    visible: boolean;
    isLoading: boolean;
    hideDetalhesProduto: () => void;
    produto: ProdutoEncontradoApiType;
}) {
    return (
        <Modal
            visible={visible}
            // onRequestClose={hideModalProductNotFound}
            animationType="slide"
            transparent={true}
        >
            <Surface style={styles.surfaceStyle}>
                {isLoading && <Text>Carregando...</Text>}
                {!isLoading && (
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: 5,
                        }}
                    >
                        <View style={{ alignItems: 'center', margin: 20 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 20,
                                }}
                            >
                                <Icon source="close-circle-outline" size={30} color="#d32f2f" />
                                <Text variant="titleLarge" style={{ marginHorizontal: 5 }}>
                                    Produto não encontrado!
                                </Text>
                            </View>
                            <Text variant="titleMedium">
                                Preencha as informações a seguir para concluir o registro da doação
                            </Text>
                        </View>
                    </View>
                )}
            </Surface>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
    },

    surfaceStyle: {
        margin: 16,
        padding: 16,
        borderRadius: 10,
        backgroundColor: 'white',
    },
});
