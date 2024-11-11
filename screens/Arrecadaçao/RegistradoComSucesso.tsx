import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';

export default function RegistradoComSucesso({
    handleClickNewRegister,
}: {
    handleClickNewRegister: () => void;
}) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                marginHorizontal: 'auto',
            }}
        >
            <View style={styles.container}>
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <Icon source="check-circle-outline" size={60} color="#81c784" />
                    <Text variant="titleMedium" style={{ marginTop: 10, textAlign: 'center' }}>
                        Doação registrada com sucesso
                    </Text>
                </View>
            </View>
            <Button
                icon={'camera'}
                mode="contained"
                onPress={() => handleClickNewRegister()}
                style={styles.scanButton}
            >
                Registrar nova doação
            </Button>

            <Button
                mode="outlined"
                onPress={() => handleClickNewRegister()}
                style={styles.scanButton}
            >
                Voltar para o menu inicial
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
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
