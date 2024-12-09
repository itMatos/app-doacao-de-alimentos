import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, Dimensions, Modal } from 'react-native';
import { Appbar, Divider, Surface, Text, Button, IconButton, Chip, Icon } from 'react-native-paper';
import InfoCategoria from './InfoCategoria';
import { SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';
import { getResumoByCampanhaId } from '@/services/RotaryApi';
import { RelatorioCategoriaType, ResumoCampanhaType } from '../Campanhas/types';
const vh = Dimensions.get('window').height / 100;
const vw = Dimensions.get('window').width / 100;

type CampanhaEmAndamentoProps = {
    navigation: any;
    route: any;
    showModal: () => void;
};

export default function CampanhaEmAndamento({
    navigation,
    route,
    showModal,
}: CampanhaEmAndamentoProps) {
    const { state, dispatch } = useContext(ArrecadacaoContext);
    const [visible, setVisible] = useState(false);
    const [resumoCampanha, setResumoCampanha] = useState<RelatorioCategoriaType[]>([]);

    useEffect(() => {
        getCampanhaAtualResumo();
    }, [state.idCampanhaEmAndamento]);

    const getCampanhaAtualResumo = async () => {
        if (state.idCampanhaEmAndamento) {
            try {
                const resumo = await getResumoByCampanhaId(state.idCampanhaEmAndamento);
                setResumoCampanha(resumo.relatorio_categorias);
            } catch (error) {
                console.log('error', error);
            }
        }
    };

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
                            />
                            <Button
                                mode="contained"
                                onPress={() => navigation.navigate('RegistrarDoacao')}
                                style={styles.scanButton}
                            >
                                Escanear código de barras
                            </Button>
                        </View>
                    </Surface>

                    <Surface style={styles.surface}>
                        <View style={styles.header}>
                            <Text variant="titleMedium" style={styles.title}>
                                {state.labelCampanhaEmAndamento}
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
                                {resumoCampanha?.length === 0 && (
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            marginLeft: 20,
                                            marginVertical: 10,
                                        }}
                                        variant="bodyLarge"
                                    >
                                        Sem arrecadação registrada
                                    </Text>
                                )}
                                {resumoCampanha?.map((data) => (
                                    <InfoCategoria
                                        key={data.categoria}
                                        category={data.categoria}
                                        quantity={data.peso_total}
                                        packages={data.qtd_total}
                                        measure={data.medida}
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
                            onPress={() => showModal()}
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
    chip: {
        backgroundColor: '#81c784',
        marginVertical: 4,
    },
});
