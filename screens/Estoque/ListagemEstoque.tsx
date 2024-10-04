import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Image } from 'react-native';
import { Appbar, FAB, Text } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { TouchableOpacity } from 'react-native';

const vh = Dimensions.get('window').height / 100;

export default function ListagemEstoqueScreen({ navigation, route }: { navigation: any; route: any }) {
    const [state, setState] = useState({ open: false });
    const [barCode, setBarCode] = useState('');

    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button mode="contained" onPress={requestPermission}>
                    Grant Permission
                </Button>
            </View>
        );
    }

    const onStateChange = ({ open }: { open: boolean }) => setState({ open });

    const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
        const teste = `Bar code with type ${type} and data ${data} has been scanned!`;
        setBarCode(data);
    };

    const { open } = state;

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <>
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />

                <Appbar.Header mode="center-aligned" elevated>
                    <Appbar.BackAction onPress={() => navigation.navigate('ProdutosEstoque')} />
                    {/* <View>
                    <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain"/>
                </View> */}
                    <Appbar.Content title="Estoque" />
                    <Appbar.Action icon="magnify" onPress={() => {}} color="white" />
                </Appbar.Header>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <Text>Listagem estoque</Text>
                    </View>

                    <View style={styles.container}>
                        <CameraView
                            style={styles.camera}
                            facing={facing}
                            barcodeScannerSettings={{
                                barcodeTypes: ['ean13'],
                            }}
                            onBarcodeScanned={(scanningResult: BarcodeScanningResult) =>
                                handleBarCodeScanned(scanningResult)
                            }
                        >
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                                    <Text style={styles.text}>Flip Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </CameraView>
                    </View>

                    <View>
                        <Text variant="headlineLarge" style={styles.textBarCode}>
                            o valor escaneado foi: {barCode}
                        </Text>
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
