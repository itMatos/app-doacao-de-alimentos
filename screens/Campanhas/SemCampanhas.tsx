import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CampanhasVazio() {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Text style={styles.title}>CAMPANHAS</Text>
            </View>
            <View style={styles.viewContainer}>
                <Text variant="headlineLarge" style={styles.textTitle}>Histórico de campanhas vazio.</Text>
                <Text variant="headlineSmall" style={styles.textDescription}>
                    Ao encerrar uma campanha de arrecadação, o resumo será mostrado aqui.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 20,
    },
    viewContainer: {
        padding: 2,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    textTitle: {
        fontSize: 24, 
        fontWeight: 'bold',
        color: '#333', 
        textAlign: 'center',
    },
    textDescription: {
        fontSize: 18,
        color: '#666', 
        textAlign: 'center',
    },
});
