import React, { useContext } from 'react';
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SemArrecadacao from './SemArrecadacao';
import CampanhaEmAndamento from './CampanhaEmAndamento';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';

export default function TelaInicial({ navigation, route }: { navigation: any; route: any }) {
    const { state } = useContext(ArrecadacaoContext);
    const teste = false;

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Appbar.Header mode="center-aligned" elevated>
                    <Appbar.Content title="Arrecadação" />
                </Appbar.Header>
            </View>
            <View style={styles.content}>
                {!state.arrecadacaoEmAndamento ? (
                    <SemArrecadacao navigation={navigation} route={route} />
                ) : (
                    <CampanhaEmAndamento navigation={navigation} route={route} />
                )}
            </View>
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
