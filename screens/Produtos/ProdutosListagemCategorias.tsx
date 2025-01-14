import React, { useContext, useRef } from 'react';
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
    const childRef = useRef<any>(null);
    const handleReloadCategories = () => {
        if (childRef.current) {
            childRef.current.reloadData();
        }
    };

    return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View>
                <Appbar.Header mode="center-aligned" elevated>
                    <Appbar.Content title="Produtos" />
                    <Appbar.Action icon={'reload'} onPress={() => handleReloadCategories()} />
                </Appbar.Header>
            </View>

            <Surface style={styles.surface} mode="flat" elevation={5}>
                <View style={styles.header}>
                    <Text variant="titleMedium" style={styles.title}>
                        Cadastrar produto
                    </Text>
                    <Text variant="titleSmall" style={styles.title}>
                        Registre um novo produto
                    </Text>
                </View>
                <Divider style={{ marginBottom: 10 }} />
                <View style={styles.innerContainer}>
                    {/* <IconButton
                        icon="barcode-scan"
                        mode="contained"
                        size={100}
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('ConsultarUsandoCamera')}
                    /> */}
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('CadastrarNovoProduto')}
                        style={styles.scanButton}
                        icon={'plus'}
                    >
                        Cadastrar novo produto
                    </Button>
                </View>
            </Surface>

            <Surface style={styles.surface} mode="flat" elevation={5}>
                <View style={styles.header}>
                    <Text variant="titleMedium" style={styles.title}>
                        Buscar produtos
                    </Text>
                    <Text variant="titleSmall" style={styles.title}>
                        Verifique se um produto já foi cadastrado
                    </Text>
                </View>
                <Divider style={{ marginBottom: 10 }} />
                <View style={styles.innerContainer}>
                    {/* <IconButton
                        icon="barcode-scan"
                        mode="contained"
                        size={100}
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('ConsultarUsandoCamera')}
                    /> */}
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('ConsultarUsandoCamera')}
                        style={styles.scanButton}
                        icon={'magnify'}
                    >
                        Consultar usando a câmera
                    </Button>
                </View>
            </Surface>

            <ListagemCategorias navigation={navigation} ref={childRef} />
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
        flexDirection: 'column',
        textAlign: 'right',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: 10,
        color: 'black',
    },
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    iconButton: {
        height: 140,
        width: 140,
        borderRadius: 100,
        backgroundColor: '#f5f5f5',
    },
    scanButton: {
        width: '70%',
        marginBottom: 15,
        borderRadius: 10,
    },
    title: {
        margin: 1,
    },
});
