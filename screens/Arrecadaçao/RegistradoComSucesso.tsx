import { vh } from '@/utils/utils';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Divider, Icon, Portal, Surface, Text, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { Provider as PaperProvider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

export default function RegistradoComSucesso() {
    const produtoTeste = {
        nome: 'Arroz Tio João',
        categoria: 'Arroz',
        quantidade: '1',
        peso: 2,
        unidadeMedida: 'kg',
    };
    const OPTIONS = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <View style={styles.container}>
                <Text variant="titleMedium" style={{ marginVertical: 10 }}>
                    <Icon source="check-circle-outline" size={24} color="#81c784" />
                    Doação registrada com sucesso
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
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
});
