import React from 'react';
import { StyleSheet, View, StatusBar, ScrollView, Dimensions } from 'react-native';
import { Appbar, Divider, Surface, Text, Button, IconButton, Chip, Icon } from 'react-native-paper';
import InfoCategoria from './InfoCategoria';

const vh = Dimensions.get('window').height / 100;

type CampanhaEmAndamentoProps = {
    navigation: any;
    route: any;
};

export default function CampanhaEmAndamento({ navigation, route }: CampanhaEmAndamentoProps) {
    const mockData = [
        {
            category: 'Feijão',
            quantity: 1000,
            packages: 80,
        },
        {
            category: 'Arroz',
            quantity: 1000,
            packages: 80,
        },
        {
            category: 'Macarrão',
            quantity: 1200,
            packages: 120,
        },
        {
            category: 'Açúcar',
            quantity: 1000,
            packages: 80,
        },
    ];

    return (
        <>
            <StatusBar barStyle="dark-content" />

            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.navigate('ArrecadacaoTelaInicial')} />
                <Appbar.Content title="Nova campanha" />
            </Appbar.Header>
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Surface style={styles.surface}>
                        <Divider />
                        <View style={styles.innerContainer}>
                            <IconButton
                                icon="barcode-scan"
                                mode="contained"
                                size={100}
                                style={styles.iconButton}
                                onPress={() => console.log('Pressed escanear código de barras')}
                            />
                            <Button
                                mode="contained"
                                onPress={() => console.log('Pressed Escanear código de barras')}
                                style={styles.scanButton}
                            >
                                Escanear código de barras
                            </Button>
                        </View>
                    </Surface>

                    <Surface style={styles.surface}>
                        <View style={styles.header}>
                            <Text variant="titleMedium" style={styles.title}>
                                Campanha 1
                            </Text>
                            <Chip
                                icon={() => (
                                    <Icon source="progress-clock" size={16} color="black" />
                                )}
                                style={{ backgroundColor: '#81c784' }}
                                compact={true}
                                textStyle={{ color: 'black' }}
                            >
                                Em andamento
                            </Chip>
                        </View>

                        <Divider />

                        <View style={styles.innerContainerCategory}>
                            <Surface style={styles.categoryContainer}>
                                {mockData.map((data, index) => (
                                    <InfoCategoria
                                        key={index}
                                        category={data.category}
                                        quantity={data.quantity}
                                        packages={data.packages}
                                    />
                                ))}
                            </Surface>
                        </View>
                    </Surface>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    surface: {
        width: '95%',
        margin: 20,
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
    title: {
        margin: 5,
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
        margin: 10,
        borderRadius: 10,
    },
    categoryContainer: {
        width: '100%',
        elevation: 0,
        borderRadius: 10,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopWidth: 0,
    },
    innerContainerCategory: {
        alignItems: 'center',
        borderRadius: 10,
    },
    chip: {
        backgroundColor: '#81c784',
        marginVertical: 4,
    },
});
