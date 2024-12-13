import { getAllCampanhas, getAllCampanhasResumo } from '@/services/RotaryApi';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Chip,
    Divider,
    Icon,
    Snackbar,
    Surface,
    Text,
} from 'react-native-paper';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ResumoCampanhaType } from './types';
import ResumoCampanha from './ResumoCampanha';
import { CampanhaContext } from '@/context/Campanha/CampanhaContext';

export default function ListagemCampanhas({ navigation, route }: { navigation: any; route: any }) {
    const { campanhaState, dispatchCampanha } = useContext(CampanhaContext);
    const { listagemCampanhas } = campanhaState;

    const [campanhas, setCampanhas] = useState<ResumoCampanhaType[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorLoadingCampanhasMessage, setErrorLoadingCampanhasMessage] = useState('');

    useEffect(() => {
        getCampanhasHistory();
    }, []);

    const getCampanhasHistory = async () => {
        setLoading(true);
        try {
            const campanhas = await getAllCampanhasResumo();
            setCampanhas(campanhas);
            dispatchCampanha({ type: 'ListarTodasCampanhas', listagemCampanhas: campanhas });
        } catch (error) {
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };

    const reloadCampanhas = async () => {
        setLoading(true);
        getCampanhasHistory();
    };

    const dataFormatada = (dataFim: string) => {
        const data = new Date(dataFim);
        const anoAtual = new Date().getFullYear();
        const anoData = data.getFullYear();

        // Formato condicional com ou sem o ano
        return format(
            data,
            anoData === anoAtual ? 'EEEEEE., dd MMM' : "EEEEEE., dd MMM 'de' yyyy",
            {
                locale: ptBR,
            }
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Appbar.Header mode="center-aligned" elevated>
                    <Appbar.Content title="Campanhas" />
                    <Appbar.Action icon={'reload'} onPress={() => reloadCampanhas()} />
                </Appbar.Header>
            </View>
            {loading && (
                <>
                    <ActivityIndicator animating={true} />
                    <Text style={styles.message} variant="titleMedium">
                        Carregando
                    </Text>
                </>
            )}
            <ScrollView>
                {!loading && campanhas.length === 0 && (
                    <Text style={styles.message} variant="titleMedium">
                        Nenhuma campanha encontrada
                    </Text>
                )}
                {listagemCampanhas.map((campanha: ResumoCampanhaType) => (
                    <Surface
                        key={campanha.id_campanha}
                        style={{ margin: 10, padding: 20, borderRadius: 8 }}
                        elevation={3}
                        mode="flat"
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                                style={{ flex: 1, marginRight: 5 }}
                                variant="titleMedium"
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {campanha.label}
                            </Text>
                            <>
                                {!!campanha?.data_fim ? (
                                    <Chip
                                        icon={() => (
                                            <Icon
                                                source="check-circle-outline"
                                                size={16}
                                                color="#FFF"
                                            />
                                        )}
                                        style={{ backgroundColor: '#C62828', height: 32 }}
                                        compact={true}
                                        textStyle={{ color: '#FFF' }}
                                    >
                                        Encerrado
                                    </Chip>
                                ) : (
                                    <Chip
                                        icon={() => (
                                            <Icon source="progress-clock" size={16} color="#FFF" />
                                        )}
                                        style={{ backgroundColor: '#81c784', height: 32 }}
                                        compact={true}
                                        textStyle={{ color: '#FFF' }}
                                    >
                                        Em andamento
                                    </Chip>
                                )}
                            </>
                        </View>
                        <View style={{ flex: 1, marginVertical: 10 }}>
                            {campanha?.data_fim !== null && (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text>Início</Text>
                                        <Text variant="bodyLarge">
                                            {dataFormatada(campanha.data_inicio)}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            marginHorizontal: 20,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Divider bold />
                                    </View>

                                    <View style={{ flexDirection: 'column' }}>
                                        <Text>Fim</Text>
                                        <Text variant="bodyLarge">
                                            {dataFormatada(campanha?.data_fim)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        <ResumoCampanha categorias={campanha.relatorio_categorias} />
                    </Surface>
                ))}
            </ScrollView>
            <Snackbar
                visible={errorLoadingCampanhasMessage !== ''}
                onDismiss={() => setErrorLoadingCampanhasMessage('')}
                action={{
                    label: 'OK',
                    onPress: () => {
                        setErrorLoadingCampanhasMessage('');
                    },
                }}
            >
                {errorLoadingCampanhasMessage}
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
});
