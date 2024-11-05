import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Appbar, Button, Chip, Divider, Icon, IconButton, Surface, Text } from 'react-native-paper';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { vh } from '@/utils/utils';

export default function RegistrarDoacao({ navigation, route }: { navigation: any; route: any }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.navigate('ArrecadacaoTelaInicial')} />
                <Appbar.Content title="Registrar doação" />
            </Appbar.Header>
            <View style={styles.container}>
                {!permission && (
                    <View style={styles.container}>
                        <Text style={styles.message} variant="titleMedium">
                            É necessário permissão para acessar a câmera do dispositivo
                        </Text>
                        <Button
                            onPress={requestPermission}
                            mode="contained"
                            style={{ margin: 20, borderRadius: 10, backgroundColor: '#81c784' }}
                        >
                            Conceder permissão
                        </Button>
                    </View>
                )}

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <Text style={styles.messageCamera} variant="headlineSmall">
                        Aponte a câmera do dispositivo para o código de barras
                    </Text>
                    <CameraView style={styles.camera} facing={facing}>
                        <View style={styles.buttonContainer}>
                            {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}> */}
                            {/* <Text style={styles.text}>Flip Camera</Text> */}
                            {/* </TouchableOpacity> */}
                        </View>
                    </CameraView>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        margin: 5,
    },
    messageCamera: {
        textAlign: 'center',
        paddingBottom: 10,
        margin: 5,
    },
    camera: {
        flex: 1,
        margin: 10,
        height: 60 * vh,
        alignItems: 'center',
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
    scrollContent: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    surface: {
        marginHorizontal: 5,
        marginVertical: 20,
        borderRadius: 10,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        color: 'black',
    },
    title: {
        margin: 5,
    },
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    iconButton: {
        height: 150,
        width: 150,
        borderRadius: 100,
    },
    scanButton: {
        width: '80%',
        margin: 20,
        borderRadius: 10,
    },
    buttonCloseCampaign: {
        width: '80%',
        margin: 20,
        borderRadius: 10,
        backgroundColor: '#d32f2f',
    },
    categoryContainer: {
        width: '100%',
        elevation: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    innerContainerCategory: {
        alignItems: 'center',
        borderRadius: 100,
    },
    chip: {
        backgroundColor: '#81c784',
        marginVertical: 4,
    },
});
