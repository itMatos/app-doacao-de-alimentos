import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function SemArrecadacao({ navigation, route }: { navigation: any; route: any }) {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <View style={styles.viewContainer}>
                <View>
                    <Text variant="headlineLarge">Sem arrecadação em andamento.</Text>
                    <Text variant="headlineSmall">
                        Crie uma nova campanha de arrecadação para começar a registrar doações.
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
                        onPress={() => navigation.navigate('CriarNovaCampanha')}
                        style={styles.buttonNewCampaign}
                        contentStyle={{ height: 60 }}
                        uppercase={true}
                    >
                        Criar campanha de arrecadação
                    </Button>
                </View>
            </View>
        </SafeAreaView>
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
        flex: 1,
    },
    buttonNewCampaign: {
        borderRadius: 10,
        elevation: 0,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
