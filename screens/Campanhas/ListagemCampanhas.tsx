import { getAllCampanhas } from '@/services/RotaryApi';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Button,
    Chip,
    Divider,
    Icon,
    IconButton,
    Snackbar,
    Surface,
    Text,
} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { ca, ptBR } from 'date-fns/locale';

export default function ListagemCampanhas({ navigation, route }: { navigation: any; route: any }) {
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorLoadingCampanhasMessage, setErrorLoadingCampanhasMessage] = useState('');

    useEffect(() => {
        getCampanhasHistory();
    }, []);

    const getCampanhasHistory = async () => {
        setLoading(true);
        try {
            const campanhas = await getAllCampanhas();
            setCampanhas(campanhas);
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
        return format(new Date(dataFim), "EEEEEE, dd MMM 'de' yyyy", {
            locale: ptBR,
        });
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
                {campanhas.map((campanha: any) => (
                    <Surface key={campanha.id} style={{ margin: 10, padding: 20 }} elevation={1}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{campanha.label}</Text>

                            {!!campanha?.data_fim ? (
                                <Chip
                                    icon={() => (
                                        <Icon
                                            source="check-circle-outline"
                                            size={16}
                                            color="#FFF"
                                        />
                                    )}
                                    style={{ backgroundColor: '#C62828' }}
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
                                    style={{ backgroundColor: '#81c784' }}
                                    compact={true}
                                    textStyle={{ color: '#FFF' }}
                                >
                                    Em andamento
                                </Chip>
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            {campanha?.data_fim !== null && (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text>Início</Text>
                                        <Text variant="labelLarge">
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
                                        <Text variant="labelLarge">
                                            {dataFormatada(campanha?.data_fim)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
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
