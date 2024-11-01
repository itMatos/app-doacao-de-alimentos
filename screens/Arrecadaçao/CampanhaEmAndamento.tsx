import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Appbar, Divider, FAB, Icon, Surface, Text, TextInput } from 'react-native-paper';
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
import { Avatar, Card, IconButton } from 'react-native-paper';

const vh = Dimensions.get('window').height / 100;

export default function CampanhaEmAndamento({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
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
                <Text>Campanha em andamento</Text>
                <Surface
                    style={{
                        width: '90%',
                        height: 300,
                        margin: 20,
                        borderRadius: 10,
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        variant="titleMedium"
                        style={{
                            margin: 10,
                        }}
                    >
                        Registrar doação
                    </Text>
                    <Divider />

                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            margin: 10,
                            width: '100%',
                        }}
                    >
                        <Button
                            mode="contained-tonal"
                            onPress={() => console.log('Pressed escanear código de barras')}
                            style={{
                                margin: 'auto',
                                justifyContent: 'center',
                                borderRadius: 100,
                            }}
                            contentStyle={{
                                width: 150,
                                height: 150,
                            }}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                }}
                            >
                                <Icon source="barcode-scan" size={100} />
                            </View>
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() => console.log('Pressed Escanear código de barras')}
                            style={{
                                width: '80%',
                                margin: 10,
                                borderRadius: 10,
                            }}
                        >
                            Escanear código de barras
                        </Button>
                    </View>
                </Surface>

                {/* <Card style={{ width: '90%' }}>
                    <Card.Actions>
                        <Card.Title
                            title="Escanear código de barras"
                            subtitle="Card Subtitle"
                            left={(props) => <Avatar.Icon {...props} icon="folder" />}
                        />
                    </Card.Actions>
                </Card> */}
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
