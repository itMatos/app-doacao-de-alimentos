import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Appbar, FAB, Text, TextInput } from 'react-native-paper';
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

const vh = Dimensions.get('window').height / 100;

export default function NovaCampanha({ navigation, route }: { navigation: any; route: any }) {
    const currentDate = new Date();
    const todayDate = `${currentDate.getDate()}/${
        months[currentDate.getMonth()]
    }/${currentDate.getFullYear()}`;
    const [name, setName] = useState(`Campanha de arrecadação ${todayDate}`);

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

    const newCampaignPayload = {
        name: name,
        startDate: date,
        endDate: null,
    };

    const createNewCampaign = () => {
        console.log('Creating new campaign with payload: ', newCampaignPayload);
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />

            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.navigate('ArrecadacaoTelaInicial')} />
                <Appbar.Content title="Nova campanha" />
            </Appbar.Header>

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
                            onPress={() => createNewCampaign()}
                            contentStyle={{
                                height: 60,
                            }}
                            style={{ borderRadius: 10 }}
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
});
