import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Appbar, FAB, Text } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { CameraType, useCameraPermissions } from 'expo-camera';

const vh = Dimensions.get('window').height / 100;

export default function TelaInicial({ navigation, route }: { navigation: any; route: any }) {
    const [state, setState] = useState({ open: false });
    const [barCode, setBarCode] = useState('');

    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    return (
        <>
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />

                <Appbar.Header mode="center-aligned" elevated>
                    <Appbar.Content title="Arrecadação" />
                </Appbar.Header>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    }}
                >
                    <View style={styles.viewContainer}>
                        <Text variant="headlineLarge">Sem arrecadação em andamento.</Text>
                        <Text variant="headlineSmall">
                            Crie uma nova campanha de arrecadação para começar a receber doações.
                        </Text>
                    </View>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            mode="contained"
                            icon="plus"
                            onPress={() => console.log('Pressed')}
                            style={styles.buttonNewCampaign}
                            contentStyle={{
                                height: 60,
                            }}
                        >
                            <Text variant="titleMedium" style={styles.textNewCampaign}>
                                Criar nova campanha de arrecadação
                            </Text>
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 40,
        height: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    viewContainer: {
        padding: 2,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.5,
    },
    buttonNewCampaign: {
        borderRadius: 10,
        elevation: 0,
        alignContent: 'center',
        alignItems: 'center',
    },
    textNewCampaign: {
        color: 'white',
        fontWeight: '700',
        alignContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    textBarCode: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
});
