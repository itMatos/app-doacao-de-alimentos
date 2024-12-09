import { getResumoByCampanhaId } from '@/services/RotaryApi';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RelatorioCategoriaType } from './types';
import { Chip, Surface, Text } from 'react-native-paper';

export default function ResumoCampanha({ categorias }: { categorias: RelatorioCategoriaType[] }) {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Text style={{ marginVertical: 10 }} variant="titleLarge">
                    Arrecadação por categoria
                </Text>
            </View>

            <View
                style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
                {categorias.length === 0 && (
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }} variant="bodyLarge">
                        Sem arrecadação registrada
                    </Text>
                )}
                {categorias.map((categoria) => (
                    <Surface
                        key={categoria.categoria}
                        style={{
                            width: '48%',
                            marginBottom: 10,
                            padding: 10,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 8,
                        }}
                        elevation={3}
                        mode="flat"
                    >
                        <Text
                            style={{ marginBottom: 5, marginHorizontal: 'auto' }}
                            variant="titleMedium"
                        >
                            {categoria.categoria}
                        </Text>

                        <Chip style={styles.chipCategory} compact={true}>
                            {`${categoria.peso_total} ${categoria.medida}`}
                        </Chip>
                        <Chip compact={true} mode="outlined" style={styles.chipCategoryOutlined}>
                            {`${categoria.qtd_total} embalagens`}
                        </Chip>
                    </Surface>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    leftText: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 10,
    },
    chipCategory: {
        backgroundColor: '#81c784',
        marginTop: 5,
    },
    chipCategoryOutlined: {
        borderColor: '#81c784',
        marginTop: 5,
    },
    rightContainer: {
        flex: 1,
    },
    buttonDetails: {
        marginVertical: 4,
    },
});
