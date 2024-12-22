import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    ScrollView,
    Dimensions,
    Modal,
    RefreshControl,
} from 'react-native';
import {
    Appbar,
    Divider,
    Surface,
    Text,
    Button,
    IconButton,
    Chip,
    Icon,
    ActivityIndicator,
} from 'react-native-paper';
import InfoCategoria from './InfoCategoria';
import { SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';
import { getAllCampanhas, getResumoGeralByCampanhaId } from '@/services/RotaryApi';
import { getResumoByCampanhaId } from '@/services/RotaryApi';
import { RelatorioCategoriaType, ResumoCampanhaType } from '../Campanhas/types';
const vh = Dimensions.get('window').height / 100;
const vw = Dimensions.get('window').width / 100;

type CampanhaEmAndamentoProps = {
    navigation: any;
    route: any;
    showModal: () => void;
};

type CampaignReportType = {
    idCampanha: string;
    label: string;
    data_inicio: string;
    data_fim: string | null;
    relatorio_categorias: {
        categoria: string;
        qtd_total: number;
        peso_total: number | null;
        medida: string | null;
    }[];
};

export default function CampanhaEmAndamento({
    navigation,
    route,
    showModal,
}: CampanhaEmAndamentoProps) {
    const { state, dispatch } = useContext(ArrecadacaoContext);
    const { idCampanhaEmAndamento } = state;
    const [loading, setLoading] = useState(true);
    const [campaignReport, setCampaignReport] = useState<CampaignReportType | {}>({});
    const [refreshing, setRefreshing] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [labelCampaign, setLabelCampaign] = useState('');

    const onRefresh = () => {
        setRefreshing(true);
        handleGetResumoCampanha();
    };

    useEffect(() => {
        if (idCampanhaEmAndamento !== null) {
            handleGetResumoCampanha();
            handleGetResumoLabel();
        }
    }, [idCampanhaEmAndamento]);

    const handleGetResumoCampanha = async () => {
        if (idCampanhaEmAndamento === null) return;
        try {
            const resumoCampanha: CampaignReportType = await getResumoGeralByCampanhaId(
                idCampanhaEmAndamento
            );
            console.log('resumoCampanha', resumoCampanha);
            setCampaignReport(resumoCampanha);
        } catch (error) {
            console.log('error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleGetResumoLabel = async () => {
        if (idCampanhaEmAndamento === null) return;
        try {
            const campanhas = await getAllCampanhas();
            const campanha = campanhas.find((item: any) => item.id === idCampanhaEmAndamento);
            setLabelCampaign(campanha.label);
        } catch (error) {
            console.log('error', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        if (scrollY < 0) {
            setShowHint(true);
        } else {
            setShowHint(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'default'} translucent={true} hidden={false} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={100}
                        colors={['#0288d1', '#388e3c', '#f57c00']}
                    />
                }
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={styles.container}>
                    {showHint && (
                        <>
                            <View style={{ padding: 20 }}>
                                <Text style={styles.hint}>
                                    Puxe até o ponto indicado para recarregar
                                </Text>
                            </View>
                        </>
                    )}

                    <Surface style={styles.surface} mode="flat" elevation={5}>
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

                    <Surface style={styles.surface} mode="flat" elevation={5}>
                        <View style={styles.header}>
                            <Text variant="titleMedium" style={styles.title}>
                                {state.labelCampanhaEmAndamento}
                            </Text>
                            <Chip
                                icon={() => (
                                    <Icon source="progress-clock" size={16} color="black" />
                                )}
                                style={{ backgroundColor: '#67c16b' }}
                                compact={true}
                                textStyle={{ color: '#000' }}
                            >
                                Em andamento
                            </Chip>
                        </View>

                        <Divider />

                        {loading && (
                            <>
                                <ActivityIndicator animating={true} />
                                <Text variant="titleMedium">Carregando</Text>
                            </>
                        )}

                        {!loading &&
                            'relatorio_categorias' in campaignReport &&
                            campaignReport.relatorio_categorias.length === 0 && (
                                <View style={{ margin: 20 }}>
                                    <Text variant="titleMedium">Sem arrecadação registrada.</Text>

                                    <Text variant="titleMedium">
                                        Utilize a câmera para registrar uma nova arrecadação.
                                    </Text>
                                </View>
                            )}

                        {!loading &&
                            'relatorio_categorias' in campaignReport &&
                            campaignReport.relatorio_categorias.length > 0 && (
                                <View style={styles.innerContainer}>
                                    <Surface style={styles.categoryContainer}>
                                        {campaignReport.relatorio_categorias.map((data) => (
                                            <InfoCategoria
                                                key={data.categoria}
                                                category={data.categoria}
                                                packages={data.qtd_total}
                                                quantity={data.peso_total || 0}
                                                measure={data.medida || ''}
                                            />
                                        ))}
                                    </Surface>
                                </View>
                            )}
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
    hint: {
        textAlign: 'center',
        padding: 10,
        color: 'gray',
    },
});
