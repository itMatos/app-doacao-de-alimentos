import React, { useState } from 'react';
import { Button, Icon, Surface, Text } from 'react-native-paper';
import { Modal, StyleSheet, View } from 'react-native';
import { vh } from '@/utils/utils';

export default function ModalProductNotFound({
    visible,
    hideModalProductNotFound,
    isLoading,
    code,
    navigation,
}: {
    visible: boolean;
    hideModalProductNotFound: () => void;
    isLoading: boolean;
    code: string;
    navigation: any;
}) {
    const navigateToProductRegistration = () => {
        hideModalProductNotFound();
        navigation.navigate('Produtos', {
            screen: 'CadastrarNovoProduto',
        });
    };

    const handleClickNewRegister = () => {
        hideModalProductNotFound();
        navigateToProductRegistration();
    };

    return (
        <Modal
            visible={visible}
            onDismiss={hideModalProductNotFound}
            animationType="slide"
            transparent={true}
        >
            <Surface mode="flat" style={styles.surfaceStyle}>
                {isLoading && <Text>Carregando...</Text>}
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        marginHorizontal: 'auto',
                    }}
                >
                    <View style={styles.container}>
                        <View style={{ alignItems: 'center', marginVertical: 20 }}>
                            <Icon source="close-circle-outline" size={60} color="#d32f2f" />
                            <Text
                                variant="titleMedium"
                                style={{ marginTop: 10, textAlign: 'center' }}
                            >
                                Produto não encontrado. Deseja registrar um novo produto?
                            </Text>
                        </View>

                        <View style={{ marginTop: 'auto', marginHorizontal: 20 }}>
                            <Button
                                icon={'camera'}
                                mode="contained"
                                onPress={() => handleClickNewRegister()}
                                style={styles.scanButton}
                            >
                                Cadastrar novo produto
                            </Button>

                            <Button
                                mode="outlined"
                                onPress={() => hideModalProductNotFound()}
                                style={styles.scanButton}
                            >
                                Voltar
                            </Button>
                        </View>
                    </View>
                </View>
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
        marginTop: 40 * vh,
        justifyContent: 'center',
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
