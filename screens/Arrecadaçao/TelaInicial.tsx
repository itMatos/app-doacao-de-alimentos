import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, Modal, RefreshControl } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Button,
    Card,
    Snackbar,
    Surface,
    Text,
} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SemArrecadacao from './SemArrecadacao';
import CampanhaEmAndamento from './CampanhaEmAndamento';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';
import {
    closeCurrentCampanha,
    getCampanhaInProgress,
    getResumoGeralByCampanhaId,
} from '@/services/RotaryApi';
import { vh } from '@/utils/utils';
import { CampanhaContext } from '@/context/Campanha/CampanhaContext';
import { ResumoCampanhaType } from '../Campanhas/types';

type Campanha = {
    id: string;
    label: string;
};

export default function TelaInicial({ navigation, route }: { navigation: any; route: any }) {
    const { state, dispatch } = useContext(ArrecadacaoContext);
    const { dispatchCampanha } = useContext(CampanhaContext);
    const { arrecadacaoEmAndamento } = state;
    const [inProgress, setInProgress] = useState<Campanha[]>([]);
    const [loading, setLoading] = useState(true);
    const [closingCampaignInProgress, setClosingCampaignInProgress] = useState(false);
    const [errorCloseCampaignMessage, setErrorCloseCampaignMessage] = useState('');
    const [visibleModalCloseCampaign, setVisibleModalCloseCampaign] = useState(false);

    const showModal = () => setVisibleModalCloseCampaign(true);
    const hideModal = () => setVisibleModalCloseCampaign(false);

    useEffect(() => {
        setLoading(true);
        checkCampanhaInProgress();
    }, []);

    const checkCampanhaInProgress = async () => {
        try {
            const campanha = await getCampanhaInProgress();
            setInProgress(campanha);
        } catch (error) {
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (inProgress.length > 0) {
            const campanha = inProgress[0];
            console.log('campanha em andamento', campanha);
            getCurrentCampanhaResumo(campanha.id);
            dispatch({
                type: 'CampanhaEmAndamento',
                arrecadacaoEmAndamento: true,
                idCampanhaEmAndamento: campanha.id,
                labelCampanhaEmAndamento: campanha.label,
            });
        }
    }, [inProgress]);

    const getCurrentCampanhaResumo = async (id: string) => {
        try {
            const campanha: ResumoCampanhaType = await getResumoGeralByCampanhaId(id);
            dispatchCampanha({ type: 'AdicionarCampanha', campanha: campanha });
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        checkCampanhaInProgress();
    }, [arrecadacaoEmAndamento]);

    const handleClickConfirmCloseCampaign = async () => {
        setClosingCampaignInProgress(true);
        setLoading(true);
        const campanha = inProgress[0];

        if (!campanha) {
            setLoading(false);
            setClosingCampaignInProgress(false);
            hideModal();
            return;
        }

        try {
            await closeCurrentCampanha(campanha.id);
            dispatchCampanha({ type: 'EncerrarCampanha', id_campanha: campanha.id });
            navigation.navigate('ArrecadacaoTelaInicial');
            dispatch({ type: 'EncerrarCampanha', arrecadacaoEmAndamento: false });
        } catch (error) {
            setErrorCloseCampaignMessage('Erro ao encerrar campanha. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
            setClosingCampaignInProgress(false);
            hideModal();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Appbar.Header mode="center-aligned" elevated>
                    <Appbar.Content title="Arrecadação" />
                </Appbar.Header>
            </View>

            {loading ? (
                <>
                    <ActivityIndicator animating={true} />
                    <Text style={styles.message} variant="titleMedium">
                        Carregando
                    </Text>
                </>
            ) : (
                <View style={styles.content}>
                    {!state.arrecadacaoEmAndamento ? (
                        <SemArrecadacao navigation={navigation} route={route} />
                    ) : (
                        <CampanhaEmAndamento
                            navigation={navigation}
                            route={route}
                            showModal={showModal}
                        />
                    )}
                </View>
            )}

            <Modal
                visible={visibleModalCloseCampaign}
                onDismiss={() => hideModal()}
                animationType="fade"
                transparent={true}
                onRequestClose={() => {
                    hideModal();
                }}
                statusBarTranslucent={true}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Card elevation={0}>
                            <Card.Content>
                                {closingCampaignInProgress ? (
                                    <>
                                        <ActivityIndicator
                                            animating={true}
                                            size={'large'}
                                            style={{ alignSelf: 'center' }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Text variant="titleLarge">
                                            Tem certeza que deseja encerrar campanha? Esta ação será
                                            permanente.
                                        </Text>

                                        <Text variant="bodyLarge">
                                            Ao encerrar, você poderá acompanhar o resumo de
                                            arrecadações no menu Campanhas.
                                        </Text>
                                    </>
                                )}
                            </Card.Content>
                            {!closingCampaignInProgress && (
                                <Card.Actions>
                                    <Button onPress={handleClickConfirmCloseCampaign}>
                                        Sim, encerrar
                                    </Button>
                                    <Button onPress={hideModal}>Voltar</Button>
                                </Card.Actions>
                            )}
                        </Card>
                    </View>
                </View>
            </Modal>

            <Snackbar
                visible={errorCloseCampaignMessage !== ''}
                onDismiss={() => setErrorCloseCampaignMessage('')}
                action={{
                    label: 'OK',
                    onPress: () => {
                        setErrorCloseCampaignMessage('');
                    },
                }}
            >
                {errorCloseCampaignMessage}
            </Snackbar>
        </View>
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
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        margin: 5,
    },
    surfaceStyle: {
        flex: 1,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        marginTop: 20 * vh,
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    scrollView: {
        backgroundColor: 'none',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
