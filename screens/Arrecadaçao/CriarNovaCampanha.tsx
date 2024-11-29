import React, { useContext, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ActivityIndicator, Appbar, FAB, Text, TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { months } from '@/utils/utils';
import dayjs from 'dayjs';
import DateTimePicker, {
    DateTimePickerAndroid,
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';
import { PostNewCampaignType } from '@/types/types';
import { createNewCampaign } from '@/services/RotaryApi';

const vh = Dimensions.get('window').height / 100;

export default function CriarNovaCampanha({ navigation, route }: { navigation: any; route: any }) {
    const { state, dispatch } = useContext(ArrecadacaoContext);
    const [creatingNewCampaign, setCreatingNewCampaign] = useState(false);
    const [status, setStatus] = useState<number>(0);

    const currentDate = new Date();
    const todayDate = `${currentDate.getDate()}/${
        months[currentDate.getMonth()]
    }/${currentDate.getFullYear()}`;
    const [name, setName] = useState(`Arrecadação ${todayDate}`);

    const handleName = (text: string) => {
        setName(text);
    };

    const [date, setDate] = useState(new Date());

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        setDate(currentDate);
    };

    const showMode = (currentMode: any) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const formattedDate = dayjs(date).format('DD/MM/YYYY');

    const handleCreateNewCampaign = async () => {
        setCreatingNewCampaign(true);
        const initialDate = new Date();
        const payload: PostNewCampaignType = {
            label: name,
            data_inicio: String(initialDate),
            data_fim: null,
        };

        try {
            const response = await createNewCampaign(payload);
            setStatus(response.status);
            toggleCampanhaEmAndamento();
        } catch (error) {
            console.log('error', error);
        } finally {
            setCreatingNewCampaign(false);
        }
    };

    const toggleCampanhaEmAndamento = () => {
        const arrecadacaoEmAndamento = state.arrecadacaoEmAndamento;
        if (!arrecadacaoEmAndamento) {
            dispatch({ type: 'NovaCampanha', arrecadacaoEmAndamento: true });
            navigation.navigate('ArrecadacaoTelaInicial');
        } else {
            console.log('Já existe uma campanha em andamento');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />

            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.navigate('ArrecadacaoTelaInicial')} />
                <Appbar.Content title="Nova campanha" />
            </Appbar.Header>

            {creatingNewCampaign && (
                <>
                    <ActivityIndicator animating={true} size={'large'} />
                    <Text style={styles.message} variant="titleLarge">
                        Criando nova campanha
                    </Text>
                </>
            )}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    flex: 1,
                }}
            >
                <View style={styles.containerMain}>
                    <View style={styles.formInputs}>
                        <View>
                            <TextInput
                                label={<Text variant="headlineSmall">Nome da campanha</Text>}
                                mode="outlined"
                                style={{ width: '100%' }}
                                value={name}
                                onChangeText={handleName}
                                contentStyle={{
                                    height: 60,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            <TextInput
                                label={<Text variant="headlineSmall">Início</Text>}
                                mode="outlined"
                                value={date ? formattedDate : ''}
                                style={{
                                    width: '100%',
                                    marginVertical: 20,
                                    borderRadius: 100,
                                }}
                                onPress={showDatepicker}
                                contentStyle={{
                                    height: 60,
                                }}
                                render={(props) => (
                                    <Button
                                        icon="calendar"
                                        onPress={showDatepicker}
                                        contentStyle={{
                                            height: 60,
                                        }}
                                        style={{
                                            borderTopWidth: 0,
                                            borderWidth: 0,
                                            borderColor: 'none',
                                        }}
                                    >
                                        {formattedDate}
                                    </Button>
                                )}
                            />
                        </View>
                    </View>

                    <View style={styles.inputButtons}>
                        <Button
                            mode="contained"
                            icon="plus"
                            onPress={() => {
                                handleCreateNewCampaign();
                            }}
                            contentStyle={{
                                height: 60,
                            }}
                            style={{ borderRadius: 10 }}
                            disabled={name.trim() === ''}
                        >
                            <Text variant="titleMedium" style={styles.textNewCampaign}>
                                Criar campanha
                            </Text>
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => navigation.navigate('ArrecadacaoTelaInicial')}
                            style={{ borderRadius: 10, marginVertical: 20 }}
                            contentStyle={{
                                height: 60,
                            }}
                            disabled={creatingNewCampaign}
                        >
                            Voltar
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    containerMain: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flex: 1,
    },
    formInputs: {
        width: '85%',
    },
    inputButtons: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonNewCampaign: {
        marginTop: 20,
        borderRadius: 10,
        width: '90%',
    },
    textNewCampaign: {
        color: 'white',
        fontWeight: '700',
        alignContent: 'center',
        alignItems: 'center',
    },
    calendarContainer: {
        backgroundColor: '#FFFFFF',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        margin: 5,
    },
});
