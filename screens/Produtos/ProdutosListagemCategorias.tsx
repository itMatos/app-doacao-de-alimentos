import React, { useContext } from 'react';
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native';
import { Appbar, Button, Divider, IconButton, Surface, Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';
import ListagemCategorias from './ListagemCategorias';

export default function ProdutosListagemCategorias({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const { state } = useContext(ArrecadacaoContext);
    const teste = false;

    return (
        <ScrollView style={{ flex: 1 }}>
            <View>
                <Appbar.Header mode="center-aligned" elevated>
                    <Appbar.Content title="Produtos" />
                </Appbar.Header>
            </View>

            <Surface style={styles.surface}>
                <View style={styles.header}>
                    <Text variant="titleMedium" style={styles.title}>
                        Consultar produtos
                    </Text>
                </View>
                <Divider />
                <View style={styles.innerContainer}>
                    <IconButton
                        icon="barcode-scan"
                        mode="contained"
                        size={100}
                        style={styles.iconButton}
                    />
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('ConsultarUsandoCamera')}
                        style={styles.scanButton}
                    >
                        Consultar usando a câmera
                    </Button>
                </View>
            </Surface>

            <ListagemCategorias navigation={navigation} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
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
    title: {
        margin: 5,
    },
});
