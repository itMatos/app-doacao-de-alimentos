import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Image, StatusBar } from 'react-native';
import { Appbar, FAB, Text } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native';
import SemArrecadacao from './SemArrecadacao';
import CampanhaEmAndamento from './CampanhaEmAndamento';
import { useArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';

const vh = Dimensions.get('window').height / 100;

export default function TelaInicial({ navigation, route }: { navigation: any; route: any }) {
    const { state } = useArrecadacaoContext();
    return (
        <>
            <SafeAreaProvider>
                <SafeAreaView
                    style={{
                        flex: 1,
                    }}
                >
                    <Appbar.Header mode="center-aligned" elevated>
                        <Appbar.Content title="Arrecadação" />
                    </Appbar.Header>

                    {state.arrecadacaoEmAndamento === false ? (
                        <SemArrecadacao navigation={navigation} route={route} />
                    ) : (
                        <CampanhaEmAndamento navigation={navigation} route={route} />
                    )}
                </SafeAreaView>
            </SafeAreaProvider>
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
