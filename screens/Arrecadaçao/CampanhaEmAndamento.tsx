import React, { useContext } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, Dimensions } from 'react-native';
import { Appbar, Divider, Surface, Text, Button, IconButton, Chip, Icon } from 'react-native-paper';
import InfoCategoria from './InfoCategoria';
import { SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';
const vh = Dimensions.get('window').height / 100;
const vw = Dimensions.get('window').width / 100;

type CampanhaEmAndamentoProps = {
    navigation: any;
    route: any;
};

export default function CampanhaEmAndamento({ navigation, route }: CampanhaEmAndamentoProps) {
    const { state, dispatch } = useContext(ArrecadacaoContext);

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

    const handleCloseCampaign = () => {
        const arrecadacaoEmAndamento = state.arrecadacaoEmAndamento;
        // TODO - adicionar modal de confirmação
        if (arrecadacaoEmAndamento) {
            closeCampaign();
            navigation.navigate('ArrecadacaoTelaInicial');
        } else {
            // TODO: adicionar snackbar
            console.log('Erro ao encerrar campanha');
        }
    };

    const closeCampaign = () => {
        dispatch({ type: 'EncerrarCampanha', arrecadacaoEmAndamento: false });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={styles.container}>
                    <Surface style={styles.surface}>
                        <View style={styles.header}>
                            <Text variant="titleMedium" style={styles.title}>
                                Registrar doação
                            </Text>
                        </View>
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

                        <View style={styles.innerContainer}>
                            <Surface style={styles.categoryContainer}>
                                {mockData.map((data) => (
                                    <InfoCategoria
                                        key={data.category}
                                        category={data.category}
                                        quantity={data.quantity}
                                        packages={data.packages}
                                    />
                                ))}
                            </Surface>
                        </View>
                    </Surface>

                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            mode="contained"
                            icon={'checkbox-marked-circle-outline'}
                            onPress={() => handleCloseCampaign()}
                            style={styles.buttonCloseCampaign}
                        >
                            Encerrar campanha
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
        margin: 20,
        borderRadius: 10,
    },
    buttonCloseCampaign: {
        width: '80%',
        margin: 20,
        borderRadius: 10,
        backgroundColor: '#d32f2f',
    },
    categoryContainer: {
        width: '100%',
        elevation: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    innerContainerCategory: {
        alignItems: 'center',
        borderRadius: 100,
    },
    chip: {
        backgroundColor: '#81c784',
        marginVertical: 4,
    },
});
