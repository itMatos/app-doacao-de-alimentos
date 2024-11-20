import React, { useContext } from 'react';
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native';
import { Button, Chip, Divider, Icon, Surface, Text } from 'react-native-paper';

const mockCategorias = [
    'Arroz',
    'Feijão',
    'Macarrão',
    'Açúcar',
    'Óleo',
    'Leite',
    'Farinha',
    'Sal',
    'Café',
];

export default function ListagemCategorias() {
    // TODO: trazer listagem de categorias da api

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Surface style={styles.surface}>
                <View style={styles.header}>
                    <Text variant="titleMedium" style={styles.title}>
                        Produtos por categoria
                    </Text>

                    <Button
                        icon={() => <Icon source="plus" size={16} color="white" />}
                        mode="contained"
                        style={{ borderRadius: 10 }}
                    >
                        Criar nova categoria
                    </Button>
                </View>

                <Divider />

                <View style={styles.innerContainer}>
                    <Divider />
                    {mockCategorias.map((categoria, index) => (
                        <React.Fragment key={`fragment-${categoria}`}>
                            <View style={styles.rowContainer} key={`view-${categoria}`}>
                                <Text style={styles.leftText} key={`text-${categoria}`}>
                                    {categoria}
                                </Text>
                                <View style={styles.rightContainer}>
                                    <Button
                                        key={`button-${categoria}`}
                                        icon={() => <Icon source="arrow-right" size={16} />}
                                        mode="text"
                                        onPress={() => console.log('Ver detalhes produto')}
                                        style={styles.buttonDetails}
                                        contentStyle={{
                                            flexDirection: 'row-reverse',
                                        }}
                                    >
                                        Ver produtos cadastrados
                                    </Button>
                                </View>
                            </View>
                            <View
                                style={{ flex: 1, width: '100%' }}
                                key={`category-divider-${index}`}
                            >
                                <Divider />
                            </View>
                        </React.Fragment>
                    ))}
                </View>
            </Surface>
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
    title: {
        margin: 5,
    },
    surface: {
        marginHorizontal: 5,
        marginVertical: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    innerContainer: {
        alignItems: 'center',

        width: '100%',
    },
    categoryContainer: {
        width: '100%',
        elevation: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        color: 'black',
    },
    leftText: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        height: 80,
    },
    rightContainer: {
        flex: 1,
        margin: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    buttonDetails: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
});
