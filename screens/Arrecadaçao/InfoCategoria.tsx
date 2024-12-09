import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Chip, Divider, Icon, Text } from 'react-native-paper';

export default function InfoCategoria({
    category,
    quantity,
    packages,
    measure,
}: {
    category: string;
    quantity: number;
    packages: number;
    measure: string;
}) {
    return (
        <>
            <View style={styles.rowContainer}>
                <Text style={styles.leftText}>{category}</Text>

                <View style={styles.rightContainer}>
                    <Chip style={styles.chipCategory} compact={true}>
                        {`${quantity} kg`}
                    </Chip>
                    <Chip compact={true} mode="outlined" style={styles.chipCategoryOutlined}>
                        {`${packages} ${measure}`}
                    </Chip>
                    {/* <Button
                        icon={() => <Icon source="arrow-right" size={16} />}
                        mode="text"
                        onPress={() => console.log('Ver detalhes feijão')}
                        style={styles.buttonDetails}
                        contentStyle={{
                            flexDirection: 'row-reverse',
                        }}
                    >
                        Ver detalhes
                    </Button> */}
                </View>
            </View>
            <Divider />
        </>
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
    rightContainer: {
        flex: 1,
        margin: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    chipCategoryOutlined: {
        borderColor: '#90caf9',
        marginVertical: 4,
        backgroundColor: 'white',
    },
    chipCategory: {
        backgroundColor: '#90caf9',
        marginVertical: 4,
    },
    buttonDetails: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
});
