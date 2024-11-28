import { getAllCampanhas } from '@/services/RotaryApi';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native';
import { Appbar, Button, Chip, Divider, Icon, IconButton, Surface, Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ListagemCampanhas({ navigation, route }: { navigation: any; route: any }) {
    const [campanhas, setCampanhas] = useState([]);

    useEffect(() => {
        getCampanhasHistory();
    }, []);

    const getCampanhasHistory = async () => {
        const campanhas = await getAllCampanhas();
        console.log('campanhas', campanhas);
        setCampanhas(campanhas);
    };

    const dataFormatada = (dataFim: string) => {
        return format(new Date(dataFim), "EEE, dd MMM 'de' yyyy", {
            locale: ptBR,
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Appbar.Header mode="center-aligned" elevated>
                    <Appbar.Content title="Campanhas" />
                </Appbar.Header>
            </View>
            <View style={styles.content}>
                <Text>Campanhas</Text>
            </View>
            <ScrollView>
                {campanhas.map((campanha: any) => (
                    <Surface key={campanha.id} style={{ margin: 10, padding: 10 }} elevation={1}>
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
                        <Text>{campanha.nome_campanha}</Text>
                        <Text>{dataFormatada(campanha.data_inicio)}</Text>
                        <Text>{campanha.data_fim}</Text>
                    </Surface>
                ))}
            </ScrollView>
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
});
