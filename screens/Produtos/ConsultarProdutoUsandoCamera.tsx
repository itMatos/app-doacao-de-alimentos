import React, { useContext, useState } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, Button, Divider, IconButton, Surface, Text } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ArrecadacaoContext } from '@/context/Arrecadacao/ArrecadacaoContext';
import ListagemCategorias from './ListagemCategorias';
import { CameraType, CameraView } from 'expo-camera';
import { vh } from '@/utils/utils';

export default function ConsultarProdutoUsandoCamera({
    navigation,
    route,
}: {
    navigation: any;
    route: any;
}) {
    const { state } = useContext(ArrecadacaoContext);
    const teste = false;

    const [facing, setFacing] = useState<CameraType>('back');

    const searchProductByBarcode = async (barcode: string) => {
        console.log('barcode', barcode);
    };

    return (
        // <ScrollView style={{ flex: 1 }}>
        //     <View>
        //         <Appbar.Header mode="center-aligned" elevated>
        //             <Appbar.Content title="Consultar produto" />
        //         </Appbar.Header>
        //     </View>

        //     <CameraView
        //         // style={styles.camera}
        //         facing={facing}
        //         barcodeScannerSettings={{
        //             barcodeTypes: ['ean13', 'ean8'],
        //         }}
        //         // onBarcodeScanned={handleBarCodeScanned}
        //     >
        //         <View style={styles.buttonContainer}>
        //             <TouchableOpacity onPress={() => {}}>
        //                 <Text style={styles.text}>{''}</Text>
        //             </TouchableOpacity>
        //         </View>
        //     </CameraView>
        //     {/* <Surface style={styles.surface}>
        //         <View style={styles.header}>
        //             <Text variant="titleMedium" style={styles.title}>
        //                 Consultar produtos
        //             </Text>
        //         </View>
        //         <Divider />
        //         <View style={styles.innerContainer}>
        //             <IconButton
        //                 icon="barcode-scan"
        //                 mode="contained"
        //                 size={100}
        //                 style={styles.iconButton}
        //             />
        //             <Button
        //                 mode="contained"
        //                 onPress={() => {
        //                     console.log('clicked consultar usando camera');
        //                 }}
        //                 style={styles.scanButton}
        //             >
        //                 Consultar usando a câmera
        //             </Button>
        //         </View>
        //     </Surface> */}

        //     {/* <ListagemCategorias /> */}
        // </ScrollView>
        <CameraView
            // style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
                barcodeTypes: ['ean13', 'ean8'],
            }}
            style={{ zIndex: 1, width: '100%', height: 100 * vh }}
            onBarcodeScanned={() => searchProductByBarcode('123123')}
        >
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.text}>{''}</Text>
                </TouchableOpacity>
            </View>
        </CameraView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
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
    title: {
        margin: 5,
    },
});
